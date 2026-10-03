-- pandoc filter that turns the website's CV page (docs/cv/index.md) into the
-- body of the LaTeX CV.
--
--   * Anything inside <div class="web-only"> is dropped (the download link).
--   * The # heading and the contact paragraph under it become a centered
--     header, and the # name is handed to the template's footer.
--   * ## and ### move up a level to \section and \subsection.
--   * <br> becomes a LaTeX line break.
--   * Site-relative links (/papers/...) point at the live site, since a PDF
--     has no site to be relative to.

local SITE = 'https://shanep.github.io'

-- A list item that ends in a date (", 2013", ", Fall 2019 - present",
-- ", June 2016 - present") gets the date pushed to the right margin, the way
-- a LaTeX CV lines its dates up in a column.
local TERMS = {}
for _, w in ipairs({ 'Spring', 'Summer', 'Fall', 'Winter', 'January', 'February',
  'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December' }) do
  TERMS[w] = true
end

-- Does `words` (a list of strings) read as one date: "2013", "Fall 2019",
-- or two of those joined by "-", where the second may be "present"?
local function is_date(words)
  local function point(i)
    if words[i] and words[i]:match('^%d%d%d%d$') then return i + 1 end
    if words[i] and TERMS[words[i]] and words[i + 1]
        and words[i + 1]:match('^%d%d%d%d$') then
      return i + 2
    end
    return nil
  end
  local i = point(1)
  if not i then return false end
  if i > #words then return true end
  if words[i] ~= '-' then return false end
  if words[i + 1] == 'present' and i + 1 == #words then return true end
  local j = point(i + 1)
  return j ~= nil and j > #words
end

local function align_date(inlines)
  -- The trailing run of plain words, newest last.
  local words, first = {}, #inlines + 1
  for k = #inlines, 1, -1 do
    local el = inlines[k]
    if el.t == 'Str' then
      table.insert(words, 1, el.text)
      first = k
    elseif el.t ~= 'Space' then
      break
    end
  end
  -- Try the longest date first, up to "June 2016 - December 2020".
  for n = math.min(5, #words), 1, -1 do
    local tail = { table.unpack(words, #words - n + 1) }
    local before = words[#words - n]
    if before and before:sub(-1) == ',' and is_date(tail) then
      -- Drop the date's tokens and the comma in front of it.
      local keep, seen = pandoc.Inlines({}), 0
      local cut = #words - n
      for k = 1, #inlines do
        local el = inlines[k]
        if k >= first and el.t == 'Str' then seen = seen + 1 end
        if k < first or (el.t == 'Str' and seen <= cut) then
          keep:insert(el)
        elseif el.t == 'Space' and seen < cut then
          keep:insert(el)
        end
      end
      local last = keep[#keep]
      last.text = last.text:sub(1, -2)
      keep:insert(pandoc.RawInline('latex', '\\cvdate{' .. table.concat(tail, ' ') .. '}'))
      return keep
    end
  end
  return nil
end

function BulletList(list)
  for _, item in ipairs(list.content) do
    local b = item[1]
    if b and (b.t == 'Plain' or b.t == 'Para') then
      local aligned = align_date(b.content)
      if aligned then b.content = aligned end
    end
  end
  return list
end

local function fix_inlines(inlines)
  return inlines:walk({
    RawInline = function(el)
      if el.format == 'html' and el.text:match('^<br%s*/?>$') then
        return pandoc.LineBreak()
      end
    end,
    Link = function(el)
      if el.target:sub(1, 1) == '/' then
        el.target = SITE .. el.target
      end
      return el
    end,
  })
end

function Pandoc(doc)
  local out = pandoc.Blocks({})
  local name = nil
  local in_header = false

  for _, block in ipairs(doc.blocks) do
    if block.t == 'Div' and block.classes:includes('web-only') then
      -- skip
    elseif block.t == 'Header' and block.level == 1 then
      name = pandoc.utils.stringify(block.content)
      out:insert(pandoc.RawBlock('latex',
        '\\begin{center}\n{\\LARGE\\scshape ' .. name .. '}\\\\[6pt]'))
      in_header = true
    elseif in_header and block.t == 'Para' then
      out:insert(pandoc.Plain(fix_inlines(block.content)))
      out:insert(pandoc.RawBlock('latex', '\\end{center}'))
      in_header = false
    elseif block.t == 'Header' then
      block.level = block.level - 1
      out:insert(block)
    else
      out:insert(block)
    end
  end

  doc.blocks = out:walk({
    Inlines = function(inlines) return fix_inlines(inlines) end,
  })
  if name then
    doc.meta.name = pandoc.MetaString(name)
  end
  return doc
end
