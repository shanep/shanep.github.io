#!/usr/bin/env python3
"""Build a fixed CS425 exam from the Kurose-Ross question banks.

The CS425 exams used to draw at random from question banks whose images live on
gaia.cs.umass.edu and whose questions link to the textbook's practice site. The
testing center allows neither, so the midterm and the final are fixed sets of
questions built by this script and loaded with `edutools quiz-questions`.

    # 1. Export the whole course. Only a full common cartridge export has the
    #    banks; a qti export, or one narrowed to some quizzes, leaves them out.
    edutools export 48194 --type common_cartridge -o ~/tmp/cs425.imscc
    mkdir ~/tmp/cs425 && unzip -q ~/tmp/cs425.imscc -d ~/tmp/cs425

    # 2. Draw the questions, download their images, strip external links.
    #    --avoid skips the questions another quiz already uses; get its file
    #    with `edutools pull 48194 --only quizzes`.
    ./scripts/cs425/exam-questions.py draw ~/tmp/cs425 ~/tmp/final \\
        --bank Kurose_Ross_Chapter_1_HW_Exam=7 --bank Kurose_Ross_Chapter_2_HW_Exam=7 \\
        --points 3 --seed 1217 --avoid canvas-48194/quizzes/393662-*.questions.json

    # 3. Find the quiz's draws from the banks, so the load can remove them.
    ./scripts/cs425/exam-questions.py groups ~/tmp/cs425 393664

    # 4. Load the questions into the quiz, dry run first.
    edutools quiz-questions 393664 -c 48194 --from-file ~/tmp/final/questions.json \\
        --remove-group <id> --remove-group <id> --update-published --dry-run

Never put the output in this repository: it holds the answers, and the
repository is public.
"""

import argparse
import hashlib
import html
import json
import random
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import NamedTuple, Union

NS = {"q": "http://www.imsglobal.org/xsd/ims_qtiasiv1p2"}

# Questions that can not go on an exam, by their title in the banks.
EXCLUDE = frozenset(
    # Follow-ups whose figure or numbers are in another question ("consider
    # again the network shown above"). A fixed exam holds one without the other.
    """
    1.4-03b 1.4-03c 1.4-03d 1.4-03f 1.4-04b 1.4-04c 1.4-04d 1.4-04e 1.4-04f
    1.4-04g 1.4-05b 1.4-05c 1.4-05d 1.4-05e 1.4-09b
    2.2-12b 2.2-12c 2.2-12e 2.2-12f
    3.2-05b 3.2-05c 3.4-12b 3.4-12c 3.4-15b 3.4-16b 3.4-16c 3.4-16d 3.5-2b 3.5-2c
    3.5-2d 3.6-1b 3.6-1c 3.7-1b 3.7-1c 3.7-1d 3.7-1e 3.7-2b 3.7-2c 3.7-2d
    4.2-1b 4.2-1c 4.2-1d 4.2-2b 4.2-2c 4.2-3b 4.2-3c 4.2-4b 4.2-4c
    5.01-2 5.01-3 5.01-4 5.01-5 5.05-2
    """
    # Questions that need the internet: traceroute, speedtest.net, and reading
    # RFC 768 online.
    """
    1.4-10 1.4-11 1.7-1
    """.split()
)

# Text that is wrong in the bank, fixed in the copy that goes on the exam.
FIXES = {
    # The text and its hint point at 1.4-07c, a different scenario.
    "1.4-06d": [("1.4-07c", "1.4-06c")],
}

# The textbook's "[Note: you can find more questions like this one here.]"
# paragraphs, and any other link off the course.
NOTE_RE = re.compile(
    r'<p>(?:(?!</p>).)*?Note:(?:(?!</p>).)*?<a\b[^>]*href="(?:https?:)?//(?:(?!</p>).)*?</p>', re.S | re.I
)
LINK_RE = re.compile(r'<a\b[^>]*href="(?:https?:)?//[^"]*"[^>]*>(.*?)</a>', re.S | re.I)
IMG_RE = re.compile(r'(<img\b[^>]*?\bsrc\s*=\s*)(["\'])(https?://[^"\']+)\2', re.I)

Answer = dict[str, Union[str, int]]
Question = dict[str, Union[str, float, list[Answer]]]


class ExamError(Exception):
    """Something in the export or the arguments that stops the build."""


# ---------------------------------------------------------------------------
# Reading the export
# ---------------------------------------------------------------------------


def child(parent: ET.Element, path: str) -> ET.Element | None:
    return parent.find(path, NS)


def metadata(element: ET.Element) -> dict[str, str]:
    """The qtimetadata label and entry pairs under an item or a bank."""
    pairs: dict[str, str] = {}
    for field in element.iterfind(".//q:qtimetadatafield", NS):
        label = field.findtext("q:fieldlabel", default="", namespaces=NS)
        pairs[label] = field.findtext("q:fieldentry", default="", namespaces=NS)
    return pairs


def mattext(element: ET.Element | None) -> tuple[str, str]:
    """The first mattext under element, and its type."""
    found = element.find(".//q:mattext", NS) if element is not None else None
    if found is None:
        return "", "text/plain"
    return found.text or "", found.get("texttype", "text/plain")


def load_banks(export: Path) -> dict[str, ET.Element]:
    """Every question bank in the export, by its title."""
    banks: dict[str, ET.Element] = {}
    for path in sorted((export / "non_cc_assessments").glob("*.qti")):
        bank = child(ET.parse(path).getroot(), "q:objectbank")
        if bank is not None:
            banks[metadata(bank).get("bank_title", path.stem)] = bank
    if not banks:
        raise ExamError(f"no question banks in {export}; export the whole course as common_cartridge")
    return banks


# ---------------------------------------------------------------------------
# Converting a bank question to an edutools quiz-questions entry
# ---------------------------------------------------------------------------


def plain(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("&nbsp;", " ")).strip()


def scored(condition: ET.Element) -> bool:
    """True if the condition gives credit."""
    setvar = child(condition, "q:setvar")
    return setvar is not None and setvar.text is not None and float(setvar.text) > 0


def credited(condition: ET.Element) -> list[tuple[str, str]]:
    """(respident, value) for each varequal that earns credit.

    A multiple answer question lists its wrong choices too, wrapped in <not>,
    so those are skipped.
    """
    found: list[tuple[str, str]] = []

    def walk(node: ET.Element) -> None:
        for sub in node:
            tag = sub.tag.split("}")[-1]
            if tag == "not":
                continue
            if tag == "varequal":
                found.append((sub.get("respident", ""), sub.text or ""))
            else:
                walk(sub)

    conditions = child(condition, "q:conditionvar")
    if conditions is not None:
        walk(conditions)
    return found


class Converter:
    """Turns bank items into questions, downloading each image once."""

    def __init__(self, images: Path) -> None:
        self.images = images

    def fetch(self, url: str) -> str:
        """Download an image beside the output and return its relative path."""
        name = url.split("/LMS/images/", 1)[-1] if "/LMS/images/" in url else url.rsplit("/", 1)[-1]
        name = re.sub(r"[^A-Za-z0-9._-]+", "_", name)
        dest = self.images / name
        if not dest.exists():
            # gaia redirects http to https, so ask for https directly.
            with urllib.request.urlopen(url.replace("http://", "https://", 1), timeout=30) as response:
                dest.write_bytes(response.read())
        return f"{self.images.name}/{name}"

    def html(self, text: str) -> str:
        """Drop external links and point every image at a local copy."""
        text = LINK_RE.sub(r"\1", NOTE_RE.sub("", text))
        return IMG_RE.sub(lambda m: m.group(1) + m.group(2) + self.fetch(m.group(3)) + m.group(2), text)

    def comment(self, target: dict[str, Union[str, int]], key: str, value: tuple[str, str]) -> None:
        text, kind = value
        if not text.strip():
            return
        if kind == "text/html":
            target[f"{key}_html"] = self.html(text)
        else:
            target[key] = plain(text)

    def convert(self, item: ET.Element, points: float) -> Question:
        title = item.get("title", "")
        kind = metadata(item).get("question_type", "")
        text, text_type = mattext(child(item, "q:presentation/q:material"))
        body = text if text_type == "text/html" else f"<p>{html.escape(plain(text))}</p>"
        for old, new in FIXES.get(title, []):
            body = body.replace(old, new)

        feedback: dict[str, tuple[str, str]] = {}
        for entry in item.iterfind("q:itemfeedback", NS):
            feedback[entry.get("ident", "")] = mattext(entry)
        comments: dict[str, Union[str, int]] = {}
        for ident, key in (
            ("correct_fb", "correct_comments"),
            ("general_incorrect_fb", "incorrect_comments"),
            ("general_fb", "neutral_comments"),
        ):
            if ident in feedback:
                self.comment(comments, key, feedback[ident])

        conditions = item.findall("q:resprocessing/q:respcondition", NS)
        answers: list[Answer] = []
        extra: Question = {}
        if kind in ("multiple_choice_question", "multiple_answers_question", "true_false_question"):
            right = {value for c in conditions if scored(c) for _, value in credited(c)}
            if not right:
                raise ExamError(f"{title}: no correct answer")
            seen: set[str] = set()
            for label in item.iterfind(".//q:response_label", NS):
                label_text, label_type = mattext(label)
                ident = label.get("ident", "")
                key = plain(re.sub(r"<[^>]+>", "", label_text))
                if key in seen and ident not in right:
                    continue  # a duplicated wrong choice, as in 2.6-3
                seen.add(key)
                answer: Answer = {"answer_weight": 100 if ident in right else 0}
                if label_type == "text/html":
                    answer["answer_html"] = self.html(label_text)
                else:
                    answer["answer_text"] = plain(label_text)
                if f"{ident}_fb" in feedback:
                    self.comment(answer, "answer_comments", feedback[f"{ident}_fb"])
                answers.append(answer)
        elif kind == "matching_question":
            labels: dict[str, str] = {}
            lefts: list[tuple[str, str]] = []
            for response in item.iterfind(".//q:response_lid", NS):
                left, _ = mattext(child(response, "q:material"))
                lefts.append((response.get("ident", ""), plain(re.sub(r"<[^>]+>", "", left))))
                for label in response.iterfind(".//q:response_label", NS):
                    labels[label.get("ident", "")] = plain(mattext(label)[0])
            match = {resp: value for c in conditions if scored(c) for resp, value in credited(c)}
            used: set[str] = set()
            for resp, left in lefts:
                if resp not in match:
                    raise ExamError(f"{title}: no match for {left!r}")
                used.add(labels[match[resp]])
                answers.append({"answer_weight": 100, "answer_match_left": left, "answer_match_right": labels[match[resp]]})
            distractors = [text for text in dict.fromkeys(labels.values()) if text not in used]
            if distractors:
                extra["matching_answer_incorrect_matches"] = "\n".join(distractors)
        elif kind == "short_answer_question":
            for condition in conditions:
                if scored(condition):
                    answers += [{"answer_weight": 100, "answer_text": value} for _, value in credited(condition)]
            if not answers:
                raise ExamError(f"{title}: no accepted answer")
        else:
            raise ExamError(f"{title}: {kind} is not supported; add it to EXCLUDE or to convert()")

        question: Question = {
            "question_name": title,
            "question_type": kind,
            "points_possible": points,
            "question_text": self.html(body),
            **comments,
            **extra,
            "answers": answers,
        }
        if re.search(r'(?:href|src)=\\?"(?:https?:)?//', json.dumps(question)):
            raise ExamError(f"{title}: still links outside the course")
        return question


def natural(title: str) -> list[Union[int, str]]:
    """Sort key that puts 3.4-9 before 3.4-10."""
    return [int(part) if part.isdigit() else part for part in re.split(r"(\d+)", title)]


# ---------------------------------------------------------------------------
# draw
# ---------------------------------------------------------------------------


class Draw(NamedTuple):
    bank: str
    size: int


def parse_draw(text: str) -> Draw:
    bank, _, count = text.rpartition("=")
    if not bank or not count.isdigit() or int(count) < 1:
        raise argparse.ArgumentTypeError(f"expected BANK=COUNT, got {text!r}")
    return Draw(bank, int(count))


def avoided(paths: list[Path]) -> set[str]:
    """Question names already used by the quizzes in these JSON files."""
    names: set[str] = set()
    for path in paths:
        data: object = json.loads(path.read_text())
        if not isinstance(data, list):
            raise ExamError(f"{path}: expected a JSON list of questions")
        for entry in data:  # pyright: ignore[reportUnknownVariableType] json.loads is untyped
            if isinstance(entry, dict) and isinstance(entry.get("question_name"), str):  # pyright: ignore[reportUnknownMemberType]
                names.add(str(entry["question_name"]))  # pyright: ignore[reportUnknownArgumentType]
    return names


def draw(export: Path, out: Path, draws: list[Draw], points: float, seed: int, avoid: list[Path]) -> None:
    banks = load_banks(export)
    skip = EXCLUDE | avoided(avoid)
    images = out / "img"
    images.mkdir(parents=True, exist_ok=True)
    converter = Converter(images)
    rng = random.Random(seed)

    questions: list[Question] = []
    for bank, size in draws:
        if bank not in banks:
            raise ExamError(f"no bank {bank!r}; the export has: {', '.join(sorted(banks))}")
        items = banks[bank].findall("q:item", NS)
        eligible = [
            item for item in items
            if item.get("title", "") not in skip and metadata(item).get("question_type") != "essay_question"
        ]
        if size > len(eligible):
            raise ExamError(f"{bank}: asked for {size} but only {len(eligible)} are eligible")
        chosen = sorted(rng.sample(eligible, size), key=lambda item: natural(item.get("title", "")))
        print(f"{bank}: {len(eligible)} eligible of {len(items)}, drew {', '.join(i.get('title', '') for i in chosen)}")
        questions += [converter.convert(item, points) for item in chosen]

    (out / "questions.json").write_text(json.dumps(questions, indent=1, ensure_ascii=False))
    total = sum(float(q["points_possible"]) for q in questions)  # pyright: ignore[reportArgumentType] always a float here
    print(f"{len(questions)} questions, {total:g} points, {len(list(images.iterdir()))} images in {out}")


# ---------------------------------------------------------------------------
# groups
# ---------------------------------------------------------------------------


def md5(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()


def groups(export: Path, quiz_id: int, max_id: int) -> None:
    """Print the question groups of a quiz, which Canvas has no endpoint to list.

    A common cartridge export names every object "g" + MD5 of its global asset
    string, where a global id is shard * 10**13 + the local id. The quiz's own
    ident gives away the shard, and then each group's id can be found by trying
    local ids until one hashes to its ident.
    """
    quizzes: dict[str, ET.Element] = {}
    banks: dict[str, str] = {}
    for path in (export / "non_cc_assessments").glob("*.qti"):
        root = ET.parse(path).getroot()
        quiz = child(root, "q:assessment")
        if quiz is not None:
            quizzes[quiz.get("ident", "")[1:]] = quiz
        bank = child(root, "q:objectbank")
        if bank is not None:
            banks[bank.get("ident", "")] = metadata(bank).get("bank_title", "")

    shard = next((s for s in range(200_000) if md5(f"quizzes:quiz_{s * 10**13 + quiz_id}") in quizzes), None)
    if shard is None:
        raise ExamError(f"quiz {quiz_id} is not in the export")
    quiz = quizzes[md5(f"quizzes:quiz_{shard * 10**13 + quiz_id}")]
    sections = {
        section.get("ident", "")[1:]: section
        for section in quiz.iterfind(".//q:section", NS)
        # The quiz's own root_section holds the groups; only hashed idents are groups.
        if re.fullmatch(r"g[0-9a-f]{32}", section.get("ident", ""))
        and section.find(".//q:sourcebank_ref", NS) is not None
    }
    print(f"{quiz.get('title')}: {len(sections)} group(s) drawing from a bank")

    found: dict[str, int] = {}
    base = shard * 10**13
    for local in range(max_id):
        ident = md5(f"quizzes/quiz_group_{base + local}")
        if ident in sections:
            found[ident] = local
            if len(found) == len(sections):
                break
    for ident, section in sections.items():
        ref = section.findtext(".//q:sourcebank_ref", default="", namespaces=NS)
        pick = section.findtext(".//q:selection_number", default="?", namespaces=NS)
        group = found.get(ident)
        where = str(group) if group is not None else f"not found below {max_id}"
        print(f"  group {where}: picks {pick} from {banks.get(ref, ref)}")


# ---------------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    commands = parser.add_subparsers(dest="command", required=True)

    draw_cmd = commands.add_parser("draw", help="draw questions into a quiz-questions file")
    draw_cmd.add_argument("export", type=Path, help="the unzipped common cartridge export")
    draw_cmd.add_argument("out", type=Path, help="where questions.json and img/ go (not this repository)")
    draw_cmd.add_argument("--bank", type=parse_draw, action="append", required=True, metavar="BANK=COUNT",
                          help="draw COUNT questions from the bank titled BANK (repeatable)")
    draw_cmd.add_argument("--points", type=float, required=True, help="points per question")
    draw_cmd.add_argument("--seed", type=int, required=True, help="random seed, so the draw can be repeated")
    draw_cmd.add_argument("--avoid", type=Path, action="append", default=[], metavar="JSON",
                          help="skip questions this quiz's questions file already uses (repeatable)")

    groups_cmd = commands.add_parser("groups", help="list a quiz's question group ids")
    groups_cmd.add_argument("export", type=Path, help="the unzipped common cartridge export")
    groups_cmd.add_argument("quiz", type=int, help="the classic quiz id")
    groups_cmd.add_argument("--max-id", type=int, default=20_000_000, help="highest local group id to try")

    args = parser.parse_args()
    try:
        if args.command == "draw":
            draw(args.export, args.out, args.bank, args.points, args.seed, args.avoid)
        else:
            groups(args.export, args.quiz, args.max_id)
    except ExamError as error:
        print(f"exam-questions: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
