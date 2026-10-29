---
title: "Chapter 3: Law & Regulation, Part 2"
outline: [2, 3]
---

# Chapter 3: Law & Regulation, Part 2

**Authors:** Robert Carolina (Royal Holloway, University of London)

::: info About this page
This chapter is from [CyBOK Version 1.2.0](https://www.cybok.org/), © Crown Copyright, The National
Cyber Security Centre 2026, licensed under the
[Open Government Licence](https://www.nationalarchives.gov.uk/doc/open-government-licence/).
It was converted from the [PDF](https://www.cybok.org/wp-content/uploads/CyBOK_v1.2.0.pdf) into
a web page so that it works with screen readers and other assistive technology. Each
abbreviation is spelled out in square brackets the first time it appears, and those meanings are
ours, not the book's. So are the names of links the book prints as a bare web address. The PDF
(Portable Document Format) is the original, so if the two disagree, the PDF wins.
:::

Chapter 3 is too long for one page in Canvas, so it is split in two. [Part 1](03-law-and-regulation.md) has the introduction and §3.1-3.7, and this page has §3.8-3.14.

> *NOTICE AND DISCLAIMER: This knowledge area does not constitute the provision of legal advice or legal services and should not be relied upon as such. The work is presented as an educational aid for cyber security practitioners. Opinions expressed are solely those of the author. This work does not represent official policy or opinion of the NCSC \[National Cyber Security Centre\], the government of the United Kingdom, any state, any persons involved in its production or review, or any of their staff, employers, funders, or other persons affiliated with any of them.*

## 3.8 Intellectual property

\[<a href="#ref-85" aria-label="Reference 85">85</a>, <a href="#ref-86" aria-label="Reference 86">86</a>\]

The complexity of intellectual property law prompted a nineteenth-century US jurist to comment that this subject is closest to ‘the metaphysics of law’.[^3-142] Metaphysical or not, intellectual property can serve to constrain or encourage actions by cyber security practitioners. This section will summarise some points where the two fields intersect.

### 3.8.1 Understanding intellectual property

Intellectual property rights are negative rights – they convey the right to demand that other persons cease a prohibited activity. The nature of the activity to be prohibited is defined in the law establishing that right. Ownership of intellectual property normally conveys a right of action against others who transgress one or more acts prohibited by the relevant property right.

Intellectual property rights do not give the affirmative right for the owner to take any action imaginable with the subject matter. A given action (e.g., combining one’s own code with others, abusive intellectual property licensing practices) could infringe third-party intellectual property rights or trigger liability under competition law, among others.

Registered intellectual property rights (e.g., patents and registered trademarks) are granted on a state-by-state basis following application to an appropriate state agency, often following examination by state officials. Unregistered intellectual property rights (e.g., copyright) usually spring into existence without any need for intervention by state officials.

The term ‘public domain’ often causes confusion. In the field of intellectual property law, ‘public domain’ refers to a work in which no current intellectual property right subsists. By contrast, the phrase ‘public domain’ is also used colloquially to indicate a lack (or loss) of confidentiality. To distinguish these two, if a confidential original written work is subsequently published the contents become publicly known. Confidentiality has been lost. This work, however, may still be protected by copyright unless these rights are expressly relinquished. In contrast, if a person who writes software then declares that they are placing the code ’in the public domain’ this statement is often treated as an irretrievable relinquishment of copyright. The term should be used with care.

### 3.8.2 Catalogue of intellectual property rights

This section will describe some of the intellectual property rights most likely to be encountered by cyber security practitioners. Additional intellectual property rights that may be of interest to practitioners, but which are not addressed in this section, include protections for semiconductor topographies, the EU *sui generis* right to prevent the extraction or reutilisation of the contents of a database, and registered and unregistered design rights.

In many circumstances, contract rights (especially licensing agreements) supplement intellectual property rights and may be treated informally as a type of intellectual property. To make matters more confusing, persons in business often use the phrase ‘intellectual property’ in an expansive and colloquial fashion to refer to any work product or process that is the result of intellectual effort - whether or not it incorporates legally recognised and enforceable intellectual property rights. This section deals only with legal rights, as such.

#### 3.8.2.1 Copyright

Copyright[^3-143] is an unregistered right[^3-144] that springs into existence on the creation of a sufficiently original work. Copyright subject matter includes literary works, which for this purpose includes software code (both source and executable code). This makes copyright especially important for the developers and users of security products embodied in software.

The scope of copyright is generally said to be limited to the expression of an idea rather than the idea itself. Thus, copyright in software code normally protects only the code as written and not the functionality of the resulting software product. Protection of functionality is usually the province of patent rights.

The term of copyright is, by ICT standards, extremely long. Literary works are normally protected for the life of the author plus 70 years following their death. While the term of copyright protection granted to computer software may be less than this, it remains sufficiently long that the expiration of the copyright term is unlikely to apply to any relevant software encountered by a security practitioner within their lifetime.

Infringement of copyright normally consists of acts such as copying, transmitting, displaying or translating a significant part of the protected work. Proving that one work infringes the copyright embodied in a second work requires proof of copying. Copying can be inferred from sufficient points of similarity between the two works – there is no need to prove knowledge of copying by the accused. A plethora of forensic techniques have been developed over the course of decades to assess infringement of software source code.

Liability for copyright infringement can sometimes be avoided through various ‘fair use’ or ‘fair dealing’ limitations. These are defined differently from state to state.[^3-145]

The scope of copyright protection was expanded at the turn of the twenty-first century to encompass the right to take legal action against persons who interfere with the technological measures used to protect copyright works \[<a href="#ref-207" aria-label="Reference 207">207</a>\] at Art 11.[^3-146] This was intended to provide additional legal rights of action against those who circumvent technologies such as digital rights management systems (see the discussion in Section 3.8.4.) \[<a href="#ref-208" aria-label="Reference 208">208</a>\].

#### 3.8.2.2 Patents

A patent is a registered intellectual property right, granted on a state-by-state[^3-147] basis following application and examination. Patents are meant to protect an invention that is novel and that also includes an additional distinguishing characteristic variously described by states as an ‘inventive step’, a ‘non-obvious’ character, or something similar. This inventive step requirement is a policy device used to limit patent protection to inventions that are significant in some fashion, rather than trivial.[^3-148] Novel inventions that would have been obvious to a person skilled in the relevant technical art are normally denied patent protection.

States expressly define additional subject matter that may not be claimed as a patented invention. Common exclusions of special interest to security practitioners are software, *as such*, and an idea or mathematical formula, *as such*.[^3-149] Inventions that embody these, however, can be patentable subject matter in appropriate circumstances.

The US patent system has changed its approach to software patents in the past few decades and is increasingly receptive to them. Even states that notionally reject the concept of software patents regularly grant patents on inventions that are embodied in software. In other words, software patents (crudely speaking) are a regular feature of the ICT domain.

Cyber security-related inventions that appear on their face to be purely mathematical or algorithmic (e.g., cryptographic methods) can be the subject of patent protection as embodied in various devices – including software-enabled devices. Aspects of historically significant cryptography inventions have been protected by patents, including DES \[Data Encryption Standard\], Diffie-Helman, and RSA \[Rivest-Shamir-Adleman\] \[<a href="#ref-209" aria-label="Reference 209">209</a>\]. Although the patents on these breakthrough cryptographic inventions have now expired, the field of cyber security innovation remains awash with patents and pending patent applications \[<a href="#ref-210" aria-label="References 210–212">210–212</a>\].

The price of a patent is paid in two forms: money and public disclosure. Applications are expensive to prosecute and expensive to maintain. The process of navigating international application and examination is sufficiently complex that (expensive) expert assistance is always advisable, and often critical to success. In addition to application and examination fees paid to states, those who are granted a patent are then required to pay periodic fees to maintain the patent throughout its life.

Beyond the monetary cost, public disclosure is a core feature of the patent system. The patent application must disclose how the invention works in a manner that would enable a skilled technical practitioner to replicate it. The application and the granted patent, together with examination correspondence,[^3-150] is normally published to enable future study.[^3-151]

The term of a patent is normally 20 years from the date of application. Patents are typically subjected to an examination process which can take years to conclude. When a patent is granted, the right holder is normally given the right to take legal action retrospectively for infringements that took place after the application but before the grant, even if the infringement happened prior to the publication of the application.[^3-152] The validity of a patent can be challenged post-grant and this is a common method of defending against infringement legal actions.

Infringement of a patent normally consists of acts such as manufacturing, distributing, importing, exporting or selling a product or service that embodies the claimed invention. Proving infringement involves a forensic comparison of the accused device or service with the invention as claimed in the granted patent. There is no need for a right holder to prove that the invention was copied from the patent or from any product. Many people who infringe ICT-related patents do so initially without any awareness of third-party products or patent rights.[^3-153]

#### 3.8.2.3 Trademarks

Trademarks are usually registered[^3-154] intellectual property rights, granted on a state-by-state basis following application.[^3-155]

A trademark is a symbol or sign used to distinguish one person’s business or products from another’s. The most common trademarks consist either of words or figures.[^3-156] Trademarks are granted within defined use categories, meaning that it is possible for two different persons to have exclusive rights for the use of the same symbol in different lines of business. The purpose of trademarks is to reduce the possibility of confusion for those who procure goods or services, and to protect investment in the reputation of the enterprise supplying those goods or services.

Trademarks are normally registered for a period of 10 years, although these registrations can be renewed indefinitely.[^3-157]

Infringement of a registered trademark normally consists of displaying an identical or confusingly similar mark in combination with products or services that fall within the registered scope of exclusivity.[^3-158] Proving infringement involves comparing the accused sign with the registered trademark and assessing whether the two are identical or confusingly similar. There is no requirement to prove that the accused party has actual knowledge of the registered trademark.[^3-159]

Infringement of trademark can occur through the use of a domain name identical or confusingly similar to a registered mark. This creates well-known tensions, as domain names are (by definition) globally unique, while trademarks are not. To prove that the use of a domain name constitutes infringement of a registered trademark, a rights owners must normally prove that the domain name is identical or confusingly similar to the mark, and that the domain name is used in the supply of goods or services within the scope of exclusive use defined in the trademark registration.

Certification marks are a type of trademark that is used to demonstrate conformity with a given standard.[^3-160] These marks are registered by a standards body, which then grants licences to use the mark subject to compliance with the relevant standard. Any person who supplies relevant goods or services bearing the mark that does not conform with the relevant standard risks legal action for trademark infringement.

A collective mark is a trademark that is used to identify the members of an association, such as a professional society. Having registered the relevant collective mark, the society can take action against those who use it without authorisation, and revoke authorisation from those whose membership has ceased.

#### 3.8.2.4 Trade secrets

Trade secrets were traditionally protected under general tort law, giving persons who attempted to keep their secrets the right to take legal action against those who inappropriately obtained, used or disclosed these secrets. As the twentieth century progressed, a trend emerged to increase the legal protection of trade secrets. The position of individual US states has been significantly harmonised since the 1980s, and the US federal government adopted the Economic Espionage Act 1996 as a national trade secret law to deter trade secret theft \[<a href="#ref-213" aria-label="Reference 213">213</a>, <a href="#ref-214" aria-label="Reference 214">214</a>\]. The European Union significantly harmonised its approach to trade secrets with effect from 2018 \[<a href="#ref-215" aria-label="Reference 215">215</a>\].

The subject matter of a trade secret is generally regarded as information that is secret, is valuable because it is secret and remains secret due to the reasonable efforts of the secret keeper. Subject matter can include information as diverse as an ingredients list, a method of manufacture, a customer list, an algorithm or details of a patentable invention prior to patent application and publication. Examples of current trade secrets in ICT include the finer details of Google’s PageRank algorithm and various proprietary cryptographic algorithms.

Maintaining confidentiality is a core element of protecting a trade secret. Trade secrets can be protected indefinitely so long as secrecy is maintained.[^3-161] Unfortunately, loss of trade secrets through acts of cyber industrial espionage is believed to be widespread and should be a source of major concern for cyber security practitioners \[<a href="#ref-216" aria-label="Reference 216">216</a>\]. Loss of confidentiality of patentable subject matter can be especially damaging, as publication of inventive details by a third party prior to patent application normally destroys patentability (as the invention then ceases to be ‘novel’).

Owners of trade secret rights can normally take legal action against persons who misappropriate their secrets. In some circumstances, owners of a trade secret can also take legal action against third parties who receive a trade secret from a mis-appropriator (see the discussion in Section 3.8.4.2).

### 3.8.3 Enforcement – remedies

Consideration of the impact of intellectual property law is incomplete without also considering remedies available to a successful litigant. (See Section 3.1.5.)

#### 3.8.3.1 Criminal liability

In certain egregious circumstances, infringement of intellectual property – especially copyright and trademark – can be prosecuted as a crime. These prosecutions usually require proof that the infringing party was aware of the infringement and are often based on a pattern or practice of infringing these rights, *en masse*.

Those who violate legal prohibitions against anti-circumvention technologies for commercial advantage or financial gain, face a maximum sentence under US copyright law of 5 years for a first offence and 10 years for a second offence.[^3-162] Under British copyright law a person who manufactures, imports, distributes, etc., a device intended to circumvent these protections faces a maximum sentence of 2 years.[^3-163]

Some states classify the knowing misappropriation of a trade secret as a crime. The US adopted a national trade secret criminal law in 1996 \[<a href="#ref-214" aria-label="Reference 214">214</a>\]. These laws can serve as a basis (not necessarily the only one) for the criminal prosecution of industrial espionage activity. Some states do not define misappropriation of trade secrets as a crime.[^3-164]

#### 3.8.3.2 Civil liability

A rights owner is normally able to take legal action against a person for infringement of intellectual property. Remedies for infringement normally include monetary damages, which may be calculated by reference to a so-called reasonable royalty, a statutory tariff or a demand that the infringer make an account of any profits – a demand to pay to the rights owner the economic benefit gained from the infringement.

Civil remedies may also include orders to seize, and perhaps destroy, products that infringe intellectual property rights. These orders are especially useful when interdicting shipments of ‘knock-off’ goods that embody trademark or copyright infringements.

With respect to trade secrets, persons in the US who suffered misappropriation of a trade secret traditionally brought legal action under the relevant law of their individual state. In 2016, the US national government adopted the ‘Defend Trade Secrets Act 2016’ amending the Economic Espionage Act to authorise private rights of action under federal law for the misappropriation of trade secrets \[<a href="#ref-217" aria-label="Reference 217">217</a>\].

A common civil remedy for the infringement of intellectual property is a court order addressed to the relevant infringing party to cease any ongoing infringing activity. In the context of patent enforcement, this can be especially devastating as an enterprise finds itself unable to continue manufacturing or selling an infringing product. In the context of trade secret misappropriation, this might include an order to cease manufacturing products employing the trade secret or an order prohibiting the publication of the trade secret. (Imagine how these would increase the $Q$ value described in Section 3.1.5.)

In an online context, such orders might demand that content suppliers or server hosts take down content that infringes copyright or a trademark. Parties who enforce patents have sought orders to force a service provider to stop the operation of infringing services delivered via an online environment \[<a href="#ref-218" aria-label="Reference 218">218</a>\].

### 3.8.4 Reverse engineering

Reverse engineering, ‘the process of extracting know-how or knowledge from a human made artefact’, has generally been recognised as an accepted practice although treated differently within various categories of intellectual property law \[<a href="#ref-219" aria-label="Reference 219">219</a>, <a href="#ref-220" aria-label="Reference 220">220</a>\]. Reverse engineering has historically been viewed as the flip-side of trade secret misappropriation. While trade secret law prohibits the misappropriation of a trade secret (e.g., industrial espionage, bribery etc.), the scientific study of a device sold and purchased in a public sale in an effort to learn its secrets has generally been viewed as ‘fair game’. If a trade secret is successfully reverse engineered in this fashion and published, it ceases to be a trade secret.

Since the turn of the twenty-first century, however, the legal treatment of reverse engineering seems to have shifted following the adoption of laws prohibiting interference with anticircumvention technologies, generally making these activities more difficult \[<a href="#ref-221" aria-label="Reference 221">221</a>, <a href="#ref-222" aria-label="Reference 222">222</a>\].

Most difficulties arise in the context of reverse engineering software products. Software licenses often contain onerous restrictions, including some limitations on reverse engineering generally and/or reverse compiling specifically. European law generally prohibits any restriction on the ability of an authorised software user to observe and study the functioning of this software, and also grants these users the limited right to reverse compile specifically for the purpose of gaining interoperability information \[<a href="#ref-223" aria-label="Reference 223">223</a>\].

Pamela Samuelson has produced a useful comparative summary of this confusing landscape \[<a href="#ref-224" aria-label="Reference 224">224</a>\].

#### 3.8.4.1 Circumventing copyright technological protection measures

Following the expansion of copyright law to prohibit the circumvention of technological protection measures, those who wish to meddle with these measures do so at their peril. The implementation of these laws provides some exceptions to liability for research in specified circumstances, although the precise circumstances vary. Each exception relied upon must be examined with care.

British copyright law, for example, includes a specific exemption to liability for circumventing protection measures in copyright works *other than a computer program*, for persons conducting research into cryptography, ‘unless in so doing, or in issuing information derived from that research, he affects prejudicially the rights of the copyright owner’ (CPDA \[Copyright, Designs and Patents Act\] s.296ZA(2)). In other words, one of these researchers might face peril under the law if they were to publish details that made it possible for others to circumvent the protection measures. There is no such general exception in British law for cryptography research involving the circumvention of measures on computer programs (CPDA s.296).

#### 3.8.4.2 Testing a proprietary cryptographic algorithm

Security researchers hoping to test the strength of a cryptographic system normally require access to the relevant algorithm. This arises naturally from Kerckhoffs’s Principle and is well-known to cryptographers. A person who wishes to test the security capabilities of an algorithm encounters practical difficulties when the manufacturer of the product employs a proprietary algorithm protected by trade secret and does not wish to disclose it for testing.

In the *Megamos Crypto* case *(Volkswagen v Garcia)*, the cryptographic product under examination (a special purpose processor chip used in automobile engine immobilisers and keys) was manufactured under license by the algorithm’s developer. The testers (academic researchers) did not reverse engineer this product, which could have been accomplished using an expensive chip slicing technique. They chose instead to recover the algorithm by reverse engineering third-party software (Tango Programmer) that implemented the Megamos algorithm \[<a href="#ref-225" aria-label="Reference 225">225</a>\].

The researchers intended to publish the results of their analysis, which would have disclosed the algorithm. Parties who had an interest in the trade secret status of the algorithm brought legal action in the English courts to halt publication. The English high court was confronted with a request to prohibit publication of the research pending a full trial on the merits. The court seemed to accept that if the researchers had recovered the algorithm from the product itself using the chip slicing technique, there would be no case to answer. But the court found that there was a possibility that the third-party Tango Programmer software may have existed only as a result of trade secret misappropriation, and that the researchers should have been aware of this. The court issued a preliminary injunction prohibiting publication \[<a href="#ref-226" aria-label="Reference 226">226</a>, <a href="#ref-227" aria-label="Reference 227">227</a>\]. The case was settled before trial commenced, and the researchers eventually published a version of their paper having redacted a component of the algorithm \[<a href="#ref-228" aria-label="Reference 228">228</a>\].

### 3.8.5 International treatment and conflict of law

The existence of intellectual property rights and assessment of first ownership are normally measured by reference to the place where these rights come into existence \[<a href="#ref-206" aria-label="Reference 206">206</a>\].

After creation in one state, the existence of copyright is generally recognised in most states around the world by the operation of various copyright treaties \[<a href="#ref-229" aria-label="Reference 229">229</a>\]. If an author writes some software while resident in State $A$, the copyright laws of State $A$ are normally viewed as the source of authority for identifying the existence and first ownership of that copyright, while treaties oblige most other states to enforce that copyright within their territories (subject to limitations or exclusions granted by those states).

Grants of registered intellectual property rights (e.g., patents and registered trademarks) are made on a state-by-state basis. When identical or confusingly similar trademarks are registered in different states to different owners, the rights of each owner are equally valid within their respective registered territory. This can cause confusion when a trademark owner in one state makes an accusation of infringement against the owner of a second, nearly identical, trademark in another state \[<a href="#ref-230" aria-label="Reference 230">230</a>\].

Infringement, and defences to infringement, are normally assessed by reference to the law of the place where the intellectual property is infringed \[<a href="#ref-206" aria-label="Reference 206">206</a>\]. In cases of copyright, the courts show a persistent willingness to apply the rules (and limitations) imposed by their domestic copyright laws with respect to works that are distributed or displayed in-state via the Internet \[<a href="#ref-73" aria-label="Reference 73">73</a>, <a href="#ref-109" aria-label="Reference 109">109</a>\]. The courts are also willing to enforce domestic patents against domestic instantiations of claimed inventions delivered as part of a global service offering \[<a href="#ref-218" aria-label="Reference 218">218</a>\].

## 3.9 Internet intermediaries - shields from liability and take-down procedures

\[<a href="#ref-85" aria-label="Reference 85">85</a>, <a href="#ref-86" aria-label="Reference 86">86</a>\]

During the 1990s, policy makers around the world adopted special exceptions to shield certain communication service providers from liability for online content in prescribed circumstances. The changes were made in response to early cases that held these communication service providers liable under then-existing interpretations of content liability laws including copyright and defamation. These shields may be structured as affirmative defences, meaning that the use of the shield rests upon the ability of an accused to prove that they are entitled to be treated under the relevant exception.

In the European Union, these exceptions to liability were generally mandated by articles 12-15 of the Ecommerce Directive. These provide generalised liability shields in respect of ‘mere conduit’, ‘hosting’ and ‘caching’ services \[<a href="#ref-187" aria-label="Reference 187">187</a>\].[^3-165] These principles are transposed into member state law in the usual fashion.

In US law, various shields from liability arising under copyright, defamation etc., have been adopted on a subject-by-subject basis.[^3-166]

The widest scope of exemption from liability is normally afforded to those whose service consists of acting as a mere conduit for data.[^3-167] These carriers are often exempted from liability without exception, although they may be ordered to filter traffic as part of a court-ordered enforcement plan \[<a href="#ref-109" aria-label="Reference 109">109</a>\].

Those who provide a service that consists of nothing more than hosting data are often exempted from content-related liability, unless and until they have reason to know that their infrastructure is hosting illicit content.[^3-168] At this point, they often have an obligation to take down offending content ‘expeditiously’. Confusion over how to implement this obligation resulted in changes to some laws which now specify in detail how take-down notices should be sent to hosting organisations, and how hosting organisations are required to reply to these notices.[^3-169]

The topic of shielding service intermediaries from liability is not without controversy. Policy makers re-examine these liability exception provisions from time to time \[<a href="#ref-231" aria-label="References 231–234">231–234</a>\]. In 2018, the US Congress amended the main US content liability shield so that it no longer protects any person in cases arising from claims of promoting prostitution or acting in reckless disregard of sex trafficking.[^3-170]

## 3.10 Dematerialisation of documents and electronic trust services

As the age of ecommerce developed, concerns grew about how to transpose traditional methods for assuring information authenticity and integrity (e.g., signatures, seals, and indelible ink) into a form that could be used in fully electronic and online environments. Security technology experts responded with an array of new technologies (often based on PKI \[Public Key Infrastructure\]) intended to address these concerns.

This, in turn, prompted a series of legal concerns which potentially interfere with the utility of such technologies. These broadly fit into three categories. The first relates to the admissibility of electronic documents into evidence in legal proceedings. The second category are laws that threaten legal enforceability of communications made in electronic form. The third category relates to uncertainty about rights and responsibilities in the provision and use of identification trust services.

### 3.10.1 Admission into evidence of electronic documents

The admissibility[^3-171] of electronic data as evidence into legal proceedings, once the subject of much suspicion by courts, has now become commonplace. Policy makers and judges have become increasingly confident as practitioners have developed forensic techniques to assure the authenticity and integrity of this data. Occasionally, local rules mandate special procedures for admitting electronic evidence. While forensic disputes about the weight to be accorded to this evidence persist, this is conceptually no different from arguments that might arise about any other type of recorded evidence.

### 3.10.2 Requirements of form and the threat of unenforceability

A requirement of form is any obligation imposed by applicable law that a given communication will be enforceable if and only if it takes a prescribed form. A failure to comply with an applicable requirement of form creates the risk that the subject matter of the communication will become unenforceable in whole or in part.

Different states have adopted differing requirements of form over the course of centuries in response to whatever policy issue was ascendant at the time. As a result, these requirements are remarkably diverse and can arise in a wide variety of circumstances.

Examples of requirements of form adopted by various states include rules demanding that, in order to be enforceable:

- certain legal notices must be delivered ‘in writing’;
- certain types of commitment must be in writing and ‘signed’ by (or ‘executed under the hand of’, etc.) the party against whom enforcement is sought;
- certain submissions to a state agency must be made using a specified form;
- certain contract clauses or notices that seek to restrict liability must be presented in a prominent fashion (e.g., all in uppercase letters, bold or italic font, etc) to the party against whom they are to be enforced;
- certain contract clauses that seek to restrict liability must be initialled by the party against whom they are to be enforced;
- a last will and testament must be delivered in writing and signed by the testator in the presence of a prescribed number of witnesses, who must also sign the document; and
- a document transferring title to certain types of property must be signed in the presence of a state judicial official, who must then affix an official seal to the document.

The examples above are merely intended to acquaint the practitioner with some of the more common types of requirement adopted within different laws by different states. Some states and some laws impose relatively few requirements, while others aggressively adopt a variety of such requirements.

Electronic trading systems developed as early as the 1960s (see Section 3.6.2.2) managed to work around many such problems. Requirements of form were overcome using a framework contract. Participants enter into written agreements (with wet-ink-on-paper signatures or following whatever other requirement of form might be imposed on these contracts) which constitute the foundation of the contractual relationships between participants.[^3-172]

Newer trading platforms built on open standards, often directed to both businesses and consumers, made early gains by trading in subject matter (e.g., the sale of books and other small consumer goods) where contracts could be concluded, and payments settled, with few if any challenges based on requirements of form.[^3-173]

There is a broad international consensus that it should be possible to create and conduct business relationships in an online environment. In 1996, the United Nations formally encouraged all states to enable online trading relationships \[<a href="#ref-235" aria-label="Reference 235">235</a>\]. Many states around the world contemporaneously adopted a variety of laws and regulations designed to enable the online conduct of various types of transactions, trading relationships, administrative reporting, court filings, etc. Many were adopted in the specific context of enabling digital signatures and trust services, as discussed in Section 3.10.3.

The legal enforceability of communications related to other subject matter, especially topics such as the disposition of a deceased’s estate and the transfer of title to immovable property, have been slower to transition to electronic platforms. These often retain significant requirements of form that make the electronic implementation of relevant communications impracticable unless and until states decide to amend their laws.

### 3.10.3 Electronic signatures and identity trust services

The emergence of modern ecommerce was contemporaneous with the emergence of identity trust services, specifically those that issue digital certificates that bind the identity of a person with a given public key in a PKI.

As engineering standards for these identity trust services began to emerge, two related legal questions surfaced for consideration by anyone who wished to provide or make use of these services:

- the extent to which a digital ‘signature’ produced using such a system would be accorded legal equivalence with a wet-ink-on-paper signature; and
- the nature of rights and responsibilities of various persons involved in the maintenance and use of these systems.

The question of legal equivalence for signatures is merely a sub-set of the more general problem of requirements of form discussed in Section 3.10.2. To the extent that various laws impose a requirement to ‘sign’ a communication, many states have adopted laws to provide legal equivalence to electronic signatures in most, but not all, circumstances.

The question of rights and responsibilities of persons involved in trust service arrangements is significantly more complex \[<a href="#ref-236" aria-label="Reference 236">236</a>\].

Consider first the potential liabilities of a certificate issuer in a standard three-corner operational model.[^3-174] The law of negligence (see Section 3.7.1) immediately creates a number of challenges for any person operating as a certificate issuer, among them: what is the nature of the duty owed to a third party relying on a certificate; what are appropriate standards of care in this new operational model; and what harm is foreseeable when errors occur? Specific liability scenarios range from a system-wide disaster caused by the undetected compromise of a root certificate or technical flaw in the authentication mechanism, to the occasional (although recurring and perhaps inevitable) cases of improperly issuing a certificate following the misidentification of a signatory.

Consider also the potential liabilities of a signatory or a third party who relies on a certificate. Early policy debate focussed significantly on the degree to which signatures should be binding on the relevant signatory – especially when that person may have lost control of the signature creation device. This is a surprisingly old issue in law, commonly encountered in the context of cheque-signing machines, signature stamps, and the like, adopted by businesses, financial institutions, medical professionals, etc. Much of the policy debate over this issue appears now to be concentrated on the subject-matter laws governing specific use cases, such as those adopted to regulate electronic payment services \[<a href="#ref-189" aria-label="Reference 189">189</a>, <a href="#ref-190" aria-label="Reference 190">190</a>\].

A lack of certainty over these issues has caused certificate issuers to seek out methods to limit or otherwise rationalise their liability. A common strategy for limiting liability, entering into contracts which include limitation clauses, faces a significant problem. Forming a contract between the issuer and the relying person normally requires the communication of offer and acceptance between these persons (see Section 3.6). Most systems were designed to enable reliance without the constant intervention of presenting a user with new terms and conditions every time a relying party encountered a new certificate vendor. Similarly, certificate issuers might wish to warn relying parties about the scope of appropriate subject matter for which the certificates might be used.

The technology development community attempted to address these concerns by incorporating in the certificates specific data fields designed to communicate reliance limits and scope of use limits.[^3-175] This strategy faced a different set of legal challenges. In practice, the certificates tend to be buried in rarely-accessed segments of the user interface. Further, a vast number of end users whose machines might be relying on these certificates would likely fail to comprehend the data presented in them, as certificate data tends to be presented in a highly technical fashion. In these circumstances, significant doubt has emerged about the ability to create an enforceable limitation of liability between the certificate issuer and the relying third party.[^3-176]

States and legal experts intervened with a variety of recommendations, and then laws, attempting to address these issues \[<a href="#ref-237" aria-label="References 237–240">237–240</a>\].[^3-177] These laws, often identified with the term ‘digital signature’ or ‘electronic signature’ in their titles, typically adopted some combination of the following policy interventions:

- mandating the acceptance of electronic signatures as legal evidence;
- mandating the legal equivalence of electronic signatures that meet certain minimum technical characteristics to assure message authentication and integrity;
- instructing judges that electronic signatures (even those which provide little or no technical assurance of authentication or integrity) cannot be refused legal equivalence merely because they take an electronic form, but leaving open the possibility of denying equivalence for other reasons;
- imposing on a certificate issuer a duty of care owed to third parties who rely on certificates;
- reversing the burden of proof for negligent operation of a certificate issuer enterprise, so that an injured third party is no longer required to prove negligence but instead the certificate issuer is required to prove non-negligent operation;
- establishing frameworks for regulation to encourage higher technical and non-technical standards of care in the operation of a certificate issuance business;
- providing to certificate issuers the ability to limit their financial liability by presenting the limitation in the certificate itself, whether or not the relying third party actually sees this limitation; and
- providing to certificate issuers the ability to exclude liability for certain subject matter by presenting the exclusion in the certificate itself, whether or not the third party actually reviews this exclusion.

There is some degree of variance between states on how they have chosen to address these issues. Not all states have adopted all of these interventions. Many of these interventions are subject to a variety of additional conditions or limitations. A recurring theme concerns the unwillingness of law makers to reduce rights otherwise afforded by consumer protection laws.

While some of these laws are general in nature, others are more narrowly drawn to address specific subject matter. In some cases, the law delegates authority to a regulatory body to adopt specific secondary legislation and/or technical standards on a subject-specific basis. Any practitioner who hopes to develop a platform in an area where requirements of form are commonplace must research and review applicable laws and regulations to reduce enforceability risk.

While much debate and discussion has focused on certificate issuers, signatories, and third parties who rely on certificates, another actor in this domain is more often overlooked: the person who selects which certificate issuers should be trusted by default. This ‘certificate issuer selection’ role is routinely undertaken, for example, by producers of consumer web browsers. This is perhaps inevitable, as the vast majority of end users would have no rational method of discriminating between good-quality and poor-quality certificate issuers. This raises the question of defining what duty of care these certificate issuer selectors might owe to end users.[^3-178]

### 3.10.4 Conflict of law – electronic signatures and trust services

The nature of electronic signatures and trust services invariably implicates conflicts of law when relevant parties are in different states. Consider a certificate issuer located in State $A$, a signatory located in State $B$ who procures a certificate and uses it to create digital signatures, and a third party relying on the certificate located in State $C$.

Assessing the legal equivalence of the signature can become complicated depending on which law imposes a relevant requirement of form that mandates a ‘signature’. In the case of documents that purport to transfer title to immovable property, the legal equivalence question will almost certainly be answered by reference to the law of the state where the immovable property is located without any regard to the location of certificate issuer, signatory, or third party relying. (I.e., this could be a fourth State $D$.) The state where the immovable property is located is, in nearly all circumstances, the only one that can credibly assert enforcement jurisdiction over a title dispute as it is the only sovereign that could seize the property. In matters of a simple contract between a non-consumer signatory and non-consumer third party, the European courts should be willing to find formal validity of the contract if it meets the requirements of validity applied by the law of the state chosen by the parties to govern the contract, the law of State $B$, the law of State $C$, or possibly the law of either party’s habitual residence if different from any of these (Rome I, Art 11) \[<a href="#ref-191" aria-label="Reference 191">191</a>\]. Where consumers are involved, the European courts would only find such a cross-border contract valid if it was deemed valid under the law of the consumer’s habitual residence.

Determining the applicable law concerning limitations of liability is similarly complex. Consider, for example, the ability of a certificate issuer to rely on a limitation of liability granted under the trust services or digital signature law of State $A$. If the third party in State $C$ brings a negligence action against the certificate issuer, the applicable tort law may well be the law of State $C$ (see Section 3.7.6). The law of State $C$ may not recognise the liability limitation otherwise granted by State $A$ law, especially in cases where injured persons are acting as consumers. In other words, the value of any liability exclusion or limit granted by such laws becomes questionable when relationships cross borders.

## 3.11 Other regulatory matters

This section will briefly address additional miscellaneous regulatory topics that a cyber security practitioner might be expected to encounter.

### 3.11.1 Industry-specific regulations and NIS Directive

A wide variety of single-industry regulators have embraced cyber security within the framework of their larger role regulating subject industries \[<a href="#ref-241" aria-label="Reference 241">241</a>\]. Many financial services regulators, for example, in their role as regulators of operational risk in financial services, have always had some degree of subject matter jurisdiction over cyber security operations. Details of cyber security risk management have increased in prominence within financial services regulation and can be expected to continue to feature prominently \[<a href="#ref-242" aria-label="Reference 242">242</a>\].

Similarly, within professions that owe legally mandated duties of confidentiality to clients or whose clients enjoy legally mandated privileges prohibiting disclosure of client-professional communications (e.g., lawyers and physicians) professional regulators have become increasingly attuned to problems of cyber security.

Many of these various regulations include obligations to report or disclose security breaches. Such disclosure requirements operate in addition to any obligations imposed by data protection law (see Section 3.4.7). This creates a potentially confusing landscape when considering disclosure obligations \[<a href="#ref-243" aria-label="Reference 243">243</a>\].

As states have begun to focus more heavily on cyber security risks, existing regulators have been encouraged to bring cyber security into their supervisory and regulatory frameworks especially in the context of critical national infrastructure.

In the European Union this has been accelerated by the adoption of the EU directive on network and information systems (NIS Directive) \[<a href="#ref-244" aria-label="Reference 244">244</a>\]. article 14 of the Directive requires member states to ensure that ‘operators of essential services’:

- ‘take appropriate and proportionate technical and organisational measures to manage the risks posed to the security of network and information systems which they use in their operations’;
- ‘take appropriate measures to prevent and minimise the impact of incidents affecting the security of the network and information systems used for the provision of such essential services, with a view to ensuring the continuity of those services’; and
- ‘notify, without undue delay, the competent authority or the CSIRT \[Computer Security Incident Response Team\] of incidents having a significant impact on the continuity of the essential services they provide’.

The UK implementation devolves responsibility for regulatory oversight to relevant competent authorities - instructing existing industry regulators to adopt and enforce cyber security obligations set out in the Directive \[<a href="#ref-245" aria-label="Reference 245">245</a>\].

Efforts to use regulation to heighten cyber security in society continue to take many different forms. Debate continues about which models of regulation are most effective \[<a href="#ref-246" aria-label="Reference 246">246</a>\].

### 3.11.2 Encouraging increased cyber security for products and services

The emergent Internet of Things and the accompanying growth of cloud-based services create increased risks from cyber security breaches to both consumers and business enterprises. Policy makers have begun to adopt legal frameworks for certification of compliance of products and services with various cyber security standards.

In the European Union, certification activity is expected to operate within the framework of the EU Cyber Security Act \[<a href="#ref-247" aria-label="Reference 247">247</a>\]. (See also discussion of certification marks used by public and private standards bodies in Section 3.8.2.3.)

Relevant security standards may emerge from a variety of sources \[<a href="#ref-248" aria-label="Reference 248">248</a>, <a href="#ref-249" aria-label="Reference 249">249</a>\].

### 3.11.3 Restrictions on exporting security technologies

States have long imposed restrictions on the export of goods intended for use in armed conflict. These laws grew significantly during the Cold War, as Western bloc states sought to restrict the flow of defence technologies to the Eastern bloc.[^3-179] These export limitation regimes also apply to ‘dual use’ goods: sensitive products that have legitimate uses in both peace and war. Although a surprisingly wide variety of dual use products (and services) have been caught under the terms of such restrictions, those that are caught because they embody certain cryptographic functions have been especially contentious in the field of cyber security.

Prior to the 1990s, the US (and other states) regulated the export of strong cryptographic products with an extremely broad brush. Export prohibitions were framed in such expansive language that almost any export required prior government licence. At the beginning of the 1990s, the implementation of strong cryptography in software for general purpose computers, the growing body of non-governmental research work into cryptography, the availability of the Internet as a means to distribute know-how and source code, and the increasing pressure for reliable standards-based cryptographic implementations in support of cyberspace infrastructure, collided with these same export restrictions.

In the US, a series of legal actions under US free speech law (i.e., the First Amendment to the US Constitution) were brought challenging the validity of export regulations as applied to cryptographic software. The argument presented proceeds, in essence, as follows: source code is expressive, expressive content is protected speech, therefore source code is speech, the export regulations are therefore a governmental prior restraint on speech, as a prior restraint the regulations must be extremely narrowly tailored to address a clear danger, but the regulations are in fact very broadly drawn and therefore do not meet constitutional muster. The US courts struggled with the concept of whether source code was protected ‘speech’. Eventually, in *Junger v Daley* (2000), the US Court of Appeals for the 6th Circuit held that source code was speech and found the US export regulations unconstitutionally over-broad \[<a href="#ref-250" aria-label="Reference 250">250</a>\].[^3-180] No doubt in response to this and similar legal challenges in other US Circuits, combined with heavy lobbying by the ICT industry, the US government issued revised export regulations to create significantly more limited restrictions on cryptographic exports \[<a href="#ref-251" aria-label="Reference 251">251</a>\].

Many states including the US continue to maintain export restrictions on certain dual use products, including some implementations of cryptographic technology. Anyone engaged in the production of these products should review applicable laws carefully, as violations can be prosecuted as crimes.

### 3.11.4 Matters classified as secret by a state

Practitioners who are employed or engaged by states are routinely subject to laws that mandate secrecy of certain information classified as secret by those states. Most commonly, this arises in an environment where the disclosure of relevant secrets could harm the defence of the state, the integrity of a police investigation, the safety or efficacy of persons conducting state sponsored espionage activity, etc.

These laws can sometimes be used to intervene and classify as secret the research and development work of third parties. Practitioners may also come within the remit of these laws when state security officials choose to disclose certain classified information relating to cyber threats.

These laws tend to authorise extremely severe criminal penalties for those who violate them.

## 3.12 Public international law

\[<a href="#ref-82" aria-label="Reference 82">82</a>\]

Public international law[^3-181] is the body of law that regulates relationships among and between states, which for this purpose includes international governmental organisations but excludes constituent states of a federal state. Sources of public international law include treaties, widely accepted international norms and customs, and decisions of international tribunals.

Only states are said to have ‘standing’ to enforce claims arising under public international law. Non-state persons are normally unable to take legal action against states for violation of public international law. A non-state person may hold the right to take legal action against their home state for failure to implement obligations imposed upon the state by public international law, although states normally must affirmatively grant these rights to non-state persons \[<a href="#ref-133" aria-label="Reference 133">133</a>\].[^3-182]

Similarly, international law normally seeks to regulate the behaviour of states rather than the actions of their residents or nationals.[^3-183] Cyber operations undertaken by a non-state person in State $A$ against persons or infrastructure in State $B$ normally do not constitute a violation of international law, unless the action can be attributed to State $A$ or to some other State $C$ (see Section 3.12.1.) This action by a non-state person could, however, serve as a legal justification under international law for State $B$ to take some form of proportionate countermeasure against such persons or equipment in State $A$ as an act of self-defence (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.4, cmt.2).

It has become widely accepted that principles of public international law should apply to actions taken with respect to cyberspace \[<a href="#ref-80" aria-label="References 80–82">80–82</a>, <a href="#ref-252" aria-label="Reference 252">252</a>\]. Having said this, states can and do diverge in their opinions of how these principles should be interpreted in the context of specific types of cyber operation. At the time of writing, the most comprehensive and most widely accepted published source of analysis on the application of international law to cyber operations is the restatement of international law found in the Tallinn Manual 2.0 \[<a href="#ref-82" aria-label="Reference 82">82</a>\].[^3-184]

### 3.12.1 Attributing action to a state under international law

Attribution is the process of determining if a state is legally responsible under international law for a given action. A series of international law doctrines are used to define when a state is responsible for a given act (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.14-19).[^3-185]

A given action might be legally attributed to a state if, for example:

- the action is undertaken by an agent or officer of the state (such as an active on-duty member of the state’s military or police); or
- the action is undertaken by a non-state person (such as a technology services provider) under the direction, or with the active encouragement, of state officials.

In extreme circumstances, if illicit activity is regularly initiated by non-state actors from cyber infrastructure inside the territory of a state, and that state remains willfully blind to that activity or otherwise fails to exercise appropriate due diligence in attempting to identify and restrain the illicit activity, then it may be possible to attribute the illicit activity to that state. This theory is not without controversy (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.6-7; R.14, cmt.3) \[<a href="#ref-253" aria-label="Reference 253">253</a>\].

### 3.12.2 State cyber operations in general

Public international law is founded on the principle of territorial sovereignty.[^3-186] A state is said to be sovereign within its own territory, and also has the right to conduct activities outside of its territory consistent with international law.

International law generally prohibits one state from violating the sovereignty of another (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.4). States are, however, entitled to take appropriate countermeasures in response to a second state that has violated the obligations it owes under international law to the first (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.20-26). Countermeasures are actions that would normally violate international law that are directed against the second state in an effort to encourage it to comply with its obligations under international law.

Countermeasures must be proportional to the complained-of violation of international law by the second state. Countermeasures in response to an illegal cyber operation might consist of cyber or non-cyber responses. Thus countermeasures responding to a cyber operation which violated international law could legitimately consist of so-called ‘kinetic’ responses, cyber operational responses, or economic sanctions \[<a href="#ref-254" aria-label="Reference 254">254</a>\]. This raises a recurring challenge when attempting to understand how to assess the relevant ‘proportionality’ of non-cyber countermeasures to a cyber operation that violates international law \[<a href="#ref-255" aria-label="Reference 255">255</a>\].

A cyber operation of one state directed against another state is normally contrary to the principles of international law if it interferes in the affairs of the second state (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.66). A cyber offensive operation such as a DDoS operation, for example, would constitute interference if used to coerce the second state in a manner designed to influence outcomes in, or conduct with respect to, a matter reserved to the target state (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.66, cmt.8&19). The outcomes in question need not be physical in nature, and can include domestic political outcomes (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.66, cmt.20).

A cyber operation of one state directed against another state is normally contrary to principles of international law if it constitutes a use of force or threat of same (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.68-70).

A state that is the victim of an ‘armed attack’ is entitled to take proportionate countermeasures, including the use of force (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.71). Actions that constitute an armed attack are a sub-set of acts that constitute ‘use of force’ (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.71, cmt.6). Finding the dividing line between them is challenging and is generally measured by reference to the scale and effects of the complained-of act. In the context of discussing the Stuxnet operation, for example, the Tallinn Manual 2.0 experts agreed that if Stuxnet were to be attributed to a state it would constitute a use of force; but they were divided on whether the scale and effects of the operation were sufficient to constitute an ‘armed attack’ (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.71, cmt.10).

Because of the uncertainty over when the scale and effects of a cyber operation are sufficiently severe to constitute an armed attack, it has been suggested that some states have adopted a strategy using this uncertainty to conduct cyber operations in a ‘grey zone’ somewhere between peace and armed conflict \[<a href="#ref-255" aria-label="Reference 255">255</a>\].

### 3.12.3 Cyber espionage in peacetime

Cyber espionage, *per se*, during peacetime is not generally considered a violation of international law (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.32) \[<a href="#ref-137" aria-label="Reference 137">137</a>, <a href="#ref-138" aria-label="Reference 138">138</a>, <a href="#ref-256" aria-label="Reference 256">256</a>\].[^3-187]

Cyber surveillance and evidence gathering activities conducted from within the territory of one state against persons or equipment in another state would therefore not necessarily constitute a violation of international law. Espionage methods, however, could easily violate the domestic criminal law of the second state (e.g., obtaining unauthorised access to computers). Furthermore, methods that support espionage by harming equipment within the territory of the second state would constitute a violation of that state’s sovereignty and (if sufficiently damaging) could amount to a use of force.[^3-188]

A specific example of this principle applies to state efforts to tap submarine communication cables for the purpose of intercepting communications. If a state covertly taps cables in international waters without significantly interrupting their functionality, this very likely does not constitute a violation of international law. If one state places the tap within the territorial waters of a second state, however, the operation constitutes a violation of the second state’s sovereignty (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.54, cmt.17).

### 3.12.4 Cross-border criminal investigation

Actions by one state that constitute the exercise of police power within the territory of another (unrelated)[^3-189] state normally constitute a violation of that state’s sovereignty under international law. This is easy to see in cases where police powers involve the use of force in person, such as searching physical premises, or arresting or interrogating a suspect located in the second state.

Acts of surveillance conducted from within the territory of one state that do not involve physical contact by that state’s agents with the territory of another state are more complex to analyse. While state remote surveillance actions on their own might not constitute violations of international law (see Section 3.12.3), state evidence gathering methods (such as covertly taking remote command of a botnet controller or other equipment located on the territory of another state) can constitute a violation of the other state’s sovereignty under international law (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.4, cmt.18) and may also constitute the commission of a crime under the other state’s domestic law.

Nonetheless, it is well documented that remote cyber surveillance and evidence gathering activities are conducted by the law enforcement agencies of various states from time to time with the express or implied authorisation of the investigating state, and directed against cyber infrastructure located in another, non-consenting, state \[<a href="#ref-87" aria-label="Reference 87">87</a>\].

### 3.12.5 The law of armed conflict

Upon commencement of armed conflict, the conduct of activity within the context of that conflict is said to be governed by the ‘law of armed conflict’ (also known variously as the ‘law of war’ and ‘international humanitarian law’.)[^3-190] State cyber operations conducted as part of an armed conflict are assessed by reference to the law of armed conflict. The Tallinn Manual 2.0 addresses this topic in some detail (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at Part IV \[Initialisation Vector\], R.80-154).

This field is the subject of extensive study and debate by the military leadership of many states, which invest significant time and effort producing legal guidance for their military commanders concerning that state’s interpretation and implementation of the law. Some of these are published and available for public review \[<a href="#ref-257" aria-label="References 257–259">257–259</a>\]. The US DOD \[Department of Defense\] Manual specifically addresses cyber operations \[<a href="#ref-258" aria-label="Reference 258">258</a>\].

The precise meaning of ‘armed conflict’ is subject to some disagreement, although it is widely understood that armed conflict can (and often does) exist in the absence of any formal declaration of war (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.80, cmt.2). During the course of armed conflict, some international legal obligations (e.g., the 1944 Chicago convention on civil aviation) are suspended or otherwise altered as between belligerent states engaged in hostilities.

Key principles that underpin the law of armed conflict include:

- *Military necessity*: a state may use such force as is necessary to defeat an enemy quickly and efficiently, provided that such force does not violate other principles of the law of armed conflict.
- *Humanity*: a state may not inflict suffering, injury or destruction that is not necessary to accomplish a legitimate military purpose.
- *Distinction (aka Discrimination)*: a state must endeavour to distinguish military persons and objects from civilian persons and objects. This imposes an obligation upon a belligerent state to distinguish its own military person and objects from civilian persons and objects, as well as working to distinguish enemy state military and civilian persons and objects.
- *Proportionality*: a state may not act in a manner that is unreasonable or excessive.

A recurring issue of discussion among experts concerns what is required to treat a cyber operation, on its own, as an ‘attack’ under the law of armed conflict. The Tallinn Manual 2.0 refers to such an operation as a ‘cyber attack’, which the expert group defines as a cyber operation ‘that is reasonably expected to cause injury or death to persons or damage or destruction to objects’ (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.92).[^3-191] The characterisation of a cyber operation as a cyber attack under international law is critical, as the law of armed conflict limits how states carry out such attacks.

Belligerent states are to avoid targeting their attacks (which would include cyber attacks) against civilian persons or objects (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.93, 94 & 99). Exceptions arise with respect to civilians who participate in armed conflict (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.96, 97).

Although the principles of the law of armed conflict are not significantly in dispute, how to interpret and apply these in the context of specific cyber operations raises a series of recurring questions. For example, many legal experts take the view that the principle of not targeting cyber attacks against civilian objects applies only to tangible objects and that intangible data, as such, does not fall within the legal definition of ‘object’ \[<a href="#ref-260" aria-label="Reference 260">260</a>\]. This was the view of the majority of the Tallinn Manual 2.0 expert group, although a minority of that group felt that intangibles such as data should count as ‘objects’ if the effect of damaging or altering such data was sufficiently significant (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.100, cmt.6). There is wider agreement, however, that an operation that targets and alters data, which in turn causes injury to persons or damage to property, does rise to the level of cyber attack (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.92, cmt.6).

Another difficulty in application concerns the intermingling of military and civilian cyber infrastructure. Under the law of armed conflict, if an object is used for both military and non-military purposes it becomes a military objective (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.101). This leads to the possibility that significant components of public cyber infrastructure, including dual-use data networking and cloud services infrastructure, could be characterised as a legitimate target of cyber attack in time of armed conflict (subject to other legal limitations such as the need to respect the principles of humanity and proportionality) (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.101, cmt.4-5). Some have argued that such outcomes point to the need to reconsider how public international law should operate in this context \[<a href="#ref-260" aria-label="Reference 260">260</a>\].

## 3.13 Ethics {#_3-13-ethics}

Cyber security practitioners often find themselves operating in positions of trust, where special knowledge and skills potentially give them asymmetric power to influence or disrupt the affairs of their clients or other members of the public. Those who act outside of a specific client relationship, such as product developers and academic researchers, exercise special skills in a manner that could cause harm to a wide variety of third parties. Practitioner activities often take place behind closed doors away from the glare of public scrutiny. This is a volatile mix. Ethical norms might assist in curbing behaviours that abuse positions of trust or otherwise present significant risk to the public.

Early cyber security ethics guidance focused significantly on legal risk management such as liability arising under intellectual property, data protection and privacy laws \[<a href="#ref-261" aria-label="Reference 261">261</a>\]. Although practitioners should remain aware of laws that apply to their actions, compliance with the law, on its own, may be insufficient to guide a practitioner to ethical action.[^3-192]

As a practice that is generally conducted in the absence of formal state professional regulation, it is difficult to identify generalisable norms that are expected to apply to activities undertaken by security practitioners.[^3-193] This section will survey some of the recurring issues and potential sources of guidance.

### 3.13.1 Obligations owed to a client

A review of some obligations normally owed by regulated professionals to clients may be helpful as societies (and various nascent professional bodies) continue to develop approaches to obligations that should be owed by cyber security practitioners to their clients.

At the very least, one can identify various duties of care that arise under contract or tort law to conduct services and other activities that involve risk in a reasonable fashion and with appropriate expertise. Product designers similarly owe various legal obligations under the normal rules of tort law.

Regulated professionals are normally expected to act in the best interests of their clients, to avoid conflicts of interest and to maintain the confidentiality of client affairs. While affirmatively adopting these types of obligation by contract is often non-controversial, difficulties can arise when a security practitioner and client disagree about the most appropriate course of action in specific circumstances.

Challenges can arise with respect to non-mandatory disclosure of evidence to interested third parties.[^3-194] If a practitioner discovers evidence of wrong-doing and there is no supervening legal obligation to report that evidence, the practitioner and client might disagree concerning the disclosure of such evidence to interested third parties such as relevant police authorities, CERTs \[Computer Emergency Response Team\] or tort victims.

These cases can be difficult to navigate. In cases of evidence of economic crimes directed against the client (e.g., petty theft), the client may view public disclosure as more damaging than handling the matter solely on an internal disciplinary basis. In cases where an employee is found to have harmed a third party through tortious action such as negligence, disclosing this evidence to the victim may work to the financial detriment of the client’s company through vicarious liability.

Other difficult cases arise when the interests of the practitioner and their client are not aligned. Some professional ethics systems, for example, allow a regulated professional to disclose some parts of a client’s confidential information as part of a legitimate bill collecting activity (e.g., by filing a legal action for breach of contract relating to the delivery of confidential services). Such disclosures must normally be limited to information that is necessary to pursue collection and may come with obligations to seek appropriate protective orders from the courts.

Actions by a practitioner that interfere with the proper functioning of their client’s infrastructure in an effort to exercise undue influence over the client are unsavoury at best, and might cross a line into criminal conduct at worst. An express or implied threat of such action seems no better.

It remains to be seen whether cyber security practitioner-client relationships will become the subject of formal state regulation or licensure in due course.

### 3.13.2 Codes of conduct

Various professional bodies have published codes of conduct and ethical guidelines for cyber security practitioners. Many of these refer to high-level ethical principles without the more detailed guidance that is necessary to assist practitioners with interpretation of the principles.[^3-195]

Examples of two more recent and carefully considered codes of conduct are presented below for consideration. One is framed as a code of general applicability and one is built around a defined business process.

The Association for Computing Machinery can trace its history to the mid-twentieth century and maintains a global membership of more than 100,000 \[<a href="#ref-262" aria-label="Reference 262">262</a>\]. The ACM \[Association for Computing Machinery\] Code of Ethics and Professional Conduct was extensively revised in 2018 to take account of the impact of data connectivity \[<a href="#ref-263" aria-label="Reference 263">263</a>\]. The revised ACM Code provides multiple points of guidance relevant to the field of cyber security. The ACM also provides supplementary materials to assist in understanding and applying the Code \[<a href="#ref-264" aria-label="Reference 264">264</a>\].

The ACM Code clearly demonstrates the difficulties of balancing ethical imperatives. In its admonition to avoid harm (Section 1.2), it states there is an ‘additional obligation to report any signs of system risks that might result in harm’. While the Code addresses the possibility of ‘whistle-blowing’ as a reporting technique in appropriate circumstances, it also cautions that ‘capricious or misguided reporting of risks can itself be harmful. Before reporting risks, a computing professional should carefully assess relevant aspects of the situation’.

By contrast, CREST \[Council of Registered Ethical Security Testers\] was established in the UK in the early twenty-first century originally as a membership body for firms that supply penetration testing services.[^3-196] At the time of writing, it has more than 180 accredited member firms \[<a href="#ref-265" aria-label="Reference 265">265</a>\]. Penetration testing typifies a service that should be of significant concern to the public: information asymmetry means clients are generally unable to distinguish good practice from bad, services are supplied confidentially away from public scrutiny, and practitioner errors can cause disproportionate harm to clients or third parties. The CREST Code of Conduct for CREST Qualified Individuals provides guidance on numerous topics relevant to delivering these services including service methodology, ethical business practices, and obligations owed to clients \[<a href="#ref-266" aria-label="Reference 266">266</a>\]. The CREST Code also provides a client complaint mechanism and the organisation reserves the right to expel from membership those who fail to adhere to the CREST Code. To the extent that clients mandate that suppliers of relevant services maintain CREST membership, these mandates may slowly migrate CREST from a purely voluntary membership association into a *de facto* regulator of those who supply these services.

By historical standards, cyber security presents a relatively new set of methods and processes which are at best poorly understood by the public. Generalised codes like the ACM Code are helpful, as they guide a community of persons with relevant technical expertise who may work in fields as diverse as research and development or security management. Service-specific codes like the CREST Code are helpful, as they focus clearly on specific high-risk services. Codes of conduct will undoubtedly continue to develop as the impact of cyber security practitioner activity on the public becomes better understood.

### 3.13.3 Vulnerability testing and disclosure

The process of searching for, finding, disclosing, and acting in response to, security vulnerabilities causes recurring ethical (and legal) issues \[<a href="#ref-267" aria-label="Reference 267">267</a>, <a href="#ref-268" aria-label="Reference 268">268</a>\].

#### 3.13.3.1 Testing for vulnerabilities

Practitioners who test for security vulnerabilities should consider carefully the nature of their activities. The mere act of studying and analysing objects such as tangible hardware products, locally resident licensed software, or published cryptographic primitives and communication protocols, is normally uncontroversial. It is difficult to draw a line of causation from the mere act of analysis to public harm.

Practitioners should be careful, however, to consider the source of the security object under study. There may be a distinction, for example, between reverse engineering a silicon chip to discover the functionality of a trade secret cryptographic scheme and reverse engineering third-party software of suspicious provenance that embodies the same secret methodology. Although the first might be generally permissible, the second may constitute a violation of trade secret rights and result in liability or restrictions on limiting the ability to publish results \[<a href="#ref-226" aria-label="Reference 226">226</a>, <a href="#ref-227" aria-label="Reference 227">227</a>\] (see the discussion in Section 3.8.4.2 and Note 201).

When vulnerability testing is conducted remotely, the testing methods can raise additional issues. Practitioners must first remain cognisant that unauthorised efforts to gain access to a computer system are often defined as a crime (see Section 3.5). As stated in the ACM Code Section 2.8, ‘A system being publicly accessible is not sufficient grounds on its own to imply authorization’ \[<a href="#ref-263" aria-label="Reference 263">263</a>\].[^3-197] If practitioners are testing in response to a ‘bug bounty’ program, they should review carefully the terms of the program to assure that they are not exceeding the scope of authorised testing activity.

Practitioners should also consider the potential impact of their testing methods on the stability of public or private infrastructures, including those that are the target of testing as well as intermediary and third-party systems.

#### 3.13.3.2 Disclosure of vulnerabilities

Those who find security vulnerabilities face a choice of what to do with their new-found knowledge. Choices exist on a spectrum from making no disclosure, to publishing every detail immediately to the world at large. In between these two extremes lie an array of possibilities.

Those who make no disclosure choose to do so for different reasons. Some wish to make no disclosure in an effort to avoid complicated problems of ethics and potential liability. It is difficult to reconcile this position with the ethical principle expressed in the ACM Code Section 2.8 ‘to report any signs of system risks that might result in harm’ \[<a href="#ref-263" aria-label="Reference 263">263</a>\].

Some who operate in support of state security agencies may wish maintain the secrecy of a vulnerability after deciding that the risks and benefits of disclosure outweigh the risks and benefits of maintaining secrecy \[<a href="#ref-269" aria-label="References 269–272">269–272</a>\].[^3-198] The ethics of this ‘equities’ balancing process is a topic of continued debate \[<a href="#ref-271" aria-label="Reference 271">271</a>, <a href="#ref-273" aria-label="Reference 273">273</a>\].

Finders who choose to make an immediate full public disclosure of vulnerabilities without any prior warning to any effected person may do so for a variety of reasons. Some suggest that this is the only certain method of encouraging remediation efforts by developers. Some do not wish to invest in the time-consuming process of staging the private and public disclosures described below. Some fear that engaging with developers will prompt a legal intervention prohibiting disclosure.[^3-199] It is difficult to reconcile these arguments with the guidance from the ACM Code to minimise harm.

Many practitioners follow a principle known as ‘responsible disclosure’. The idea is to disclose first on a confidential basis to a person or group of persons who may be able to remediate or mitigate the impact of the vulnerability. After a period of time has elapsed, the finder might then proceed to a second stage of public disclosure. Second-stage public disclosure is often justified by the practitioner on the theory that publication will enable other practitioners to study and avoid similar vulnerabilities, and/or incentivise product and service providers to remediate the vulnerability.

At the time of writing, there appear to be no generally agreed principles on the proper conduct of responsible disclosure. Points of divergence include:

- how to manage private disclosure when the vulnerability forms part of a widely adopted industry standard;
- how to manage private disclosure when the vulnerability is found in a product which forms a component or sub-component in downstream products;[^3-200]
- defining the appropriate length of time between private and public disclosures;
- defining what circumstances, if any, mandate an indeterminate delay to public disclosure; and
- defining how to respond if the relevant vendors or purchasers of compromised products disagree with the finder about the wisdom or timing of public disclosure.

Public disclosure of vulnerabilities could also create tortious liability for a disclosing finder, especially if the process or sequence of disclosures is poorly managed or the vulnerability is misdescribed.

Practitioners who seek to justify publication on the basis that it fits generally within the rubric of ‘responsible disclosure’ may receive a poor reception from state authorities \[<a href="#ref-226" aria-label="Reference 226">226</a>, <a href="#ref-227" aria-label="Reference 227">227</a>\].[^3-201]

Various efforts to obtain financial benefits from disclosing a vulnerability also lead to debate. Accepting a financial reward from a vendor pursuant to a published ‘bug bounty’ programme seems now to be widely accepted, especially as the vendor controls the terms of the programme \[<a href="#ref-274" aria-label="Reference 274">274</a>\]. Other more controversial tactics to monetise findings include:

- requesting a financial ‘bug bounty’ from a vendor as a condition of disclosure when the vendor has no existing bug bounty programme in place;
- selling knowledge of the vulnerability to a third-party broker, who then re-sells the information; and
- engaging in market trade activity (e.g., short-selling publicly traded shares of a vendor) in an effort to profit financially from advance knowledge that a vulnerability will soon be published \[<a href="#ref-275" aria-label="Reference 275">275</a>\].

Practitioners who find vulnerabilities during the course of their work as security researchers must further consider the extent to which they may be accountable to their employer or funder for any financial benefits obtained.

#### 3.13.3.3 Facilitating and acting on vulnerability disclosures

Product and service vendors should consider how they can facilitate and then act upon vulnerability disclosures in a manner that minimises harm to customers and third persons.[^3-202]

Key principles to facilitate proper vendor handling of vulnerability disclosures include: publishing acceptable methods for finders to disclose vulnerabilities to the vendor, working diligently to verify the vulnerability once it is disclosed, developing remediation or mitigation strategies, disseminating fixes, working with supply chain partners, and providing feedback to finders.

A framework to develop specific vendor policies and processes can be found in ISO/IEC 29147 (the process of receiving and handling information about vulnerabilities) and ISO/IEC 30111 (the process of verifying and remediating vulnerabilities) \[<a href="#ref-276" aria-label="Reference 276">276</a>, <a href="#ref-277" aria-label="Reference 277">277</a>\]. State agencies have also published varying guidance on this topic, which is revised from time to time \[<a href="#ref-278" aria-label="Reference 278">278</a>, <a href="#ref-279" aria-label="Reference 279">279</a>\].[^3-203]

## 3.14 Conclusion: Legal Risk Management

Section 3.1.5 introduced one way for a given Bob to think about the risk of legal action from a given Alice. There were many points implicit in that introduction, however, including Bob’s awareness of: Alice, her right of action, as well as details of applicable substantive and procedural law. On its own, the function presented is most helpful after-the-fact - after Bob receives a threat of legal action from Alice. The purpose of this Section is to consider legal risk management before-the-fact.

Anyone seeking to understand legal risk often begins with an information deficit. Simply learning about the many laws and regulations that can or should influence the operation of a single enterprise can be prohibitively time-consuming and expensive.

This problem multiplies according to the number of jurisdictions with which a person may be dealing – a significant challenge if cyberspace truly enables contact with every jurisdiction in the world. In the modern era of more than two hundred sovereign states recognised under public international law, plus hundreds of states that are members of a federal or similar structure, plus untold tens (or hundreds) of thousands of additional municipal jurisdictions with varying degrees of law making and enforcement authority, merely discovering the content of applicable laws and regulations and assessing enforcement risks can be a monumental task. Private law obligations imposed by contract and (potentially voluntary) self-regulatory systems complicate matters further. In a field where multinational contacts and relationships are commonplace, considerations of the effective limits of state power are also appropriate.

What follow are a few subjects for consideration when constructing a legal risk management framework.

*Identify subject matter areas of greatest risk.* The nature of the activities undertaken by a person helps to identify which laws and regulations will be of most significance to that person. For example, banks, telecommunications infrastructure providers, and providers of medical and legal services are always cognisant of their need to seek and maintain appropriate licenses for their activities. Providers of gaming (gambling) services are also very attuned to the wide variation of laws that apply specifically to their operations. And all businesses are extremely aware of the need to understand tax reporting, collection, and payment obligations.

*Consider the impact on human life.* A strict cost-benefit analysis may be useful when making operational decisions, but becomes problematic where matters of human life and safety are concerned. Laws and regulations adopted to protect human life and compensate for personal injury should be accorded special respect. A blatant disregard of such rules raise significant moral and ethical concerns and can also result in exceptional or punitive measures when these rules are enforced.

*Conduct due diligence that is aligned with identified risks.* Nobody instructs a lawyer to ‘Go and find every law in the world that arguably might apply to anything I do.’ A typical due diligence strategy involves first identifying and investigating the laws that could destroy or bankrupt an enterprise. Other laws and regulations may become increasingly significant as an enterprise grows or changes character. Foreign laws become increasingly significant as the enterprise makes increasing contact with new jurisdictions.

*Consider the practical limits of territorial enforcement jurisdiction.* In the era of online commerce, some enterprises become paralysed with fear about the potential legal obligations to hundreds of states whose residents might gain access to site content. Those that remain paralysed may go out of business. Most of the others try to adopt pragmatic approaches that include good faith efforts to filter content or otherwise block access to residents of states that characterise one’s products or services as illicit.

*Consider the relative cost of breaching a (non-criminal) legal obligation.* Committing a crime is different from failing to honour a civil obligation. There are times when the cost of answering a civil legal action is less than the cost of compliance. Most commonly, this occurs in the context of a commercial contract which has become uneconomic to perform, or a civil regulatory requirement with a fixed financial penalty. In appropriate circumstances, a person might reasonably conclude that repudiating its civil obligation (and accepting the risk of a legal action for money damages) is less expensive than fulfilling the corresponding obligation.

*Consider the risks to one’s own personal reputation, safety and liberty.* Cyber security practitioners are sometimes confronted with situations where they are tempted, or instructed, to violate criminal law. Those who face this circumstance should remember that they may personally suffer the consequences of their actions, irrespective of whatever incentive has been provided by an employer or client.

*Consider the likelihood of enforcement.* There are times when persons who have legal rights choose not to enforce them. For example, the risk of legal action from an individual natural person who has suffered a *de minimis* loss as a result of a minor business tort may be diminishingly small. If the rights of thousands or millions of these persons can be joined together in a class action lawsuit, however, the risk increases significantly.

*Consider the challenges of collecting, preserving, and presenting evidence.* Efforts to enforce legal rights and efforts to defend against claims all hinge on one’s ability to prove, or to rebut an adversary’s efforts to prove, the underlying facts in dispute. Consider what issues will require proof when an adverse party seeks to enforce a legal right, and how one can collect and preserve evidence to an appropriate forensic standard in anticipation of the need to defend against this effort. Practitioners are also cautioned to explore the parameters of any applicable document or data retention policy, which involves the routine and regularly scheduled destruction or deletion of documents. While the routine destruction of documents in accordance with a carefully defined governance policy is usually permissible, these procedures normally must be suspended to the extent that documents may be relevant to any legal action that has commenced or been threatened. Any attempt to destroy evidence that might be relevant to such a legal action often constitutes a violation of the law and can result in severe consequences.[^3-204]

*Consider vicarious liability.* The only certain way to reduce vicarious liability is to influence employee behaviour to reduce the number of acts that are tortious or otherwise violate applicable regulations. Internal governance documents intended to reduce liability to third parties should therefore be written with the goal of influencing this behaviour.

*Consider localising risky activities in separate limited liability legal persons.* Lawyers routinely counsel business clients concerning the creation and structuring of separate legal persons in an effort to contain liabilities within defined pools of investment capital. This is a complex subject that requires careful navigation.

*Consider risks that are external to the legal system, per se.* In some circumstances, the greatest risk arising from a legal action or a threat of legal action has almost nothing to do with laws or regulations, as such. Consider, for example, the impact of a potential legal action on the reputation of an organisation or the impact of an adverse finding on the maintenance of relevant state licenses to conduct business.

*Consider changes to law or enforcement policy that are likely to arise.* Societies and policy makers are generally becoming more aware of the impact of cyber security. As this awareness increases, states and their agents may increase enforcement activities, re-examine assumptions about existing policy, and intervene rapidly with amended or new laws.

## Cross-reference of Topics vs Reference Material

| Section | Goldsmith & Wu \[<a href="#ref-73" aria-label="Reference 73">73</a>\] | Tallinn Manual 2.0 \[<a href="#ref-82" aria-label="Reference 82">82</a>\] | Rowland, Kohl & Charlesworth \[<a href="#ref-85" aria-label="Reference 85">85</a>\] | Murray \[<a href="#ref-86" aria-label="Reference 86">86</a>\] | Walden \[<a href="#ref-87" aria-label="Reference 87">87</a>\] | Holt, Bossler, & Seigfried-Spellar \[<a href="#ref-88" aria-label="Reference 88">88</a>\] | Clough \[<a href="#ref-89" aria-label="Reference 89">89</a>\] | Handbook on EU data protection law \[<a href="#ref-148" aria-label="Reference 148">148</a>\] | GDPR Guidelines \[<a href="#ref-149" aria-label="Reference 149">149</a>\] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3.2 Jurisdiction | X | | X | X | X | X | X | | |
| 3.4 Data protection | | | X | X | | | | X | X |
| 3.5 Computer Crime | | | | | X | X | X | | |
| 3.6 Contract | | | X | X | | | | | |
| 3.8 Intellectual property | | | X | X | | | | | |
| 3.9 Internet intermediaries | | | X | X | | | | | |
| 3.12 Public international law | | X | | | | | | | |

[^3-142]: This is attributed to US supreme court Justice Joseph Story, who apparently used the phrase more than once \[<a href="#ref-325" aria-label="Reference 325">325</a>\]. A darker shadow was cast over the practice of intellectual property law by Lord Esher, MR \[Master of the Rolls\], when in 1892 he observed, ‘a man had better have his patent infringed, or have anything happen to him in this world, short of losing all his family by influenza, than have a dispute about a patent. His patent is swallowed up, and he is ruined. Whose fault is it? It is really not the fault of the law: it is the fault of the mode of conducting the law in a patent case’ \[<a href="#ref-326" aria-label="Reference 326">326</a>\]. Little has changed in the intervening century \[<a href="#ref-327" aria-label="Reference 327">327</a>\].

[^3-143]: Moral rights arising under an author’s rights (*droit d’auteur*) infrequently present challenges for security practitioners and is beyond the scope of this work.

[^3-144]: In United States law, copyright comes into existence automatically but must be registered prior to commencement of any US infringement proceedings.

[^3-145]: Limitations to UK copyright are codified in Chapter 3 of the Copyrights Designs and Patents Act 1988, ss.28, et seq. The US fair use exception and other limitations are codified in 17 U.S.C. §107, et seq.

[^3-146]: The implementation of this protection has been both inconsistent and controversial \[<a href="#ref-208" aria-label="Reference 208">208</a>, <a href="#ref-328" aria-label="Reference 328">328</a>\]. It is codified in US copyright law at 17 U.S.C. §1201, et seq., and in UK copyright law in Part VII of the Copyrights Designs and Patents Act 1988 at ss.296, et seq.

[^3-147]: The European Union is in the process of adopting the Unitary Patent, a single patent right that applies throughout much, but not yet all, of the territory of the EU. The status and use of this new patent right continues to evolve.

[^3-148]: Inventors should not confuse this concept from patent law with various scientific or academic definitions of significant or trivial. A scientifically trivial step can still be ‘inventive’ in patent law \[<a href="#ref-329" aria-label="Reference 329">329</a>\].

[^3-149]: The phrase ‘as such’ should serve as a warning that loopholes are about to appear, as if by magic. They are.

[^3-150]: While copies of patents and published applications from many states are now easy to find online, correspondence with the patent examiners and the prosecution history is often more difficult to obtain and may require assistance from a legal practitioner. Once obtained, however, this can be very enlightening to any person who wishes to challenge *post-facto* the validity of a granted patent.

[^3-151]: A very limited subset of patent applications for inventions are subject to a state secrecy classification and are only published in a register of secret inventions.

[^3-152]: Anyone innovating in the ICT field faces a series of related challenges. The pace of ICT innovation is so fast, the intermingling of parallel innovative ideas so commonplace, the number of patent applications filed so large, and the prior art cataloguing ICT innovation so untidy, that it is difficult to produce any innovative ICT product that does not infringe some extant third-party patent, or published or unpublished application. A typical strategy adopted by large ICT developers is to file large numbers of patent applications on their own inventions, move to market as quickly as possible with new products, and then wait to receive suggestions of patent infringement from third parties in the hope of eventually defending against some of these threats or negotiating an acceptable cross-license arrangement.

[^3-153]: In the US patent system, awareness by the infringing party of patent rights triggers a special ‘treble damages’ rule: monetary damages awarded to the rights holder are multiplied by three with effect from the date of the infringer’s awareness. This is why rights holders typically begin a US patent enforcement process by sending copies of their patents together with a ‘we wish to make you aware’ cover letter that does not expressly accuse the recipient of infringement. This, combined with the factors set out in Note 152, is why many ICT innovators assiduously avoid researching third-party patents and patent applications.

[^3-154]: Some states define ‘unregistered’ trademark rights which are similar in character to the English law tort of passing off.

[^3-155]: A Community Trademark is a single trademark that extends throughout the territory of the EU.

[^3-156]: In modern trademark practice, the relevant sign can consist of sounds or smells. A sound trademark likely to be familiar to cyber security practitioners is the ‘Intel Inside’ musical chime (US75332744, UK00002403603).

[^3-157]: Trademark UK00000000001 has been registered continuously in the UK from 1876 to date.

[^3-158]: Courts are divided on the question of whether meta-tags, not normally visible to end users, can constitute an infringement of registered trademarks. Even where meta-tags cannot be used to prove infringement, they can serve as useful evidence for other purposes such as demonstrating the knowledge or awareness of the tag author in related tort actions such as passing off.

[^3-159]: By contrast, in actions based on theories of passing off or unregistered trademark rights the complaining party is usually required to prove that the accused party has knowledge of the unregistered mark and is purposefully taking advantage of the reputation connected to that mark.

[^3-160]: An example that should be familiar to practitioners is the Wi-Fi logo (US75799630, UK00002209133) registered by Wi-Fi Alliance.

[^3-161]: A commonly-cited example of a long-standing trade secret is the formula for Coca-Cola, which remains the subject of much speculation.

[^3-162]: 17 U.S.C. §1204(a).

[^3-163]: Copyrights Designs and Patents Act 1988, s.296ZB.

[^3-164]: The European Union Directive does not mandate the criminalisation of trade secret misappropriation \[<a href="#ref-215" aria-label="Reference 215">215</a>\]

[^3-165]: Note that the Ecommerce Directive does not apply to data protection law \[<a href="#ref-187" aria-label="Reference 187">187</a>\] at Art 5(b).

[^3-166]: For example, 17 U.S.C. §512 (shielding from copyright infringement), 47 U.S.C. §230 (shielding from liability those who block or screen offensive material, although not applicable as a shield against liability arising under obscenity, intellectual property or privacy laws.) Section 230 in particular has come under increasing scrutiny by US courts as more legal actions have been taken against social media service providers.

[^3-167]: Although these legal definitions are not specifically linked to technical definitions, this concept is approximately equivalent to providing services that consist of nothing more than carrying and routing traffic at the physical, data link and/or network layers of the TCP/IP protocol suite. A good definition of the concept is found in article 12 of the Ecommerce Directive \[<a href="#ref-187" aria-label="Reference 187">187</a>\].

[^3-168]: See article 14 of the Ecommerce Directive \[<a href="#ref-187" aria-label="Reference 187">187</a>\].

[^3-169]: The best-known procedure codified in law is probably found in US copyright law at 17 U.S.C. §512(c).

[^3-170]: The ‘Allow States and Victims to Fight Online Sex Trafficking Act of 2017’ is the result of the FOSTA-SESTA bills proposed in Congress. The narrowing of the liability shield is codified in 47 U.S.C. §230(e)(5). A legal action challenging this law as a violation of US freedom of speech principles was launched shortly after its passage and remains pending at the time of writing \[<a href="#ref-330" aria-label="Reference 330">330</a>, <a href="#ref-331" aria-label="Reference 331">331</a>\].

[^3-171]: The ability to admit (to present) evidence to a court is a threshold question governed by the rules of evidence used by that court. Admissibility asks simply whether such evidence will be considered at all. If admitted into evidence, a fact finder must then assess the relative value or ‘weight’ of that evidence. Mason summarises the English law position on electronic documents in \[<a href="#ref-332" aria-label="Reference 332">332</a>\].

[^3-172]: The framework contract, in turn, would refer to a series of electronic trading rules (often called ‘the rule book’) that specified how electronic communications mapped onto legal obligations. Such ‘EDI \[electronic data interchange\]’ systems were developed at a time when telecommunications bandwidth constraints meant that trading instructions were typically transmitted in extremely small payloads using text-based (e.g., ascii) highly structured messages. The rule book was used to translate between structured messages and legally significant communication, and served as the specification for software used to access the system.

[^3-173]: By underwriting the risk of many such transactions, the positive impact of the payment card industry to the growth and success of these platforms should not be underestimated.

[^3-174]: The ‘three-corner’ model for this purpose comprises only three persons: the certificate issuer who both identifies the signatory and issues the certificate, the signatory whose identify is bound to the certificate and the third party who relies on the certificate to identify the signatory. As each of these roles becomes divided among more persons, analysing the relationships and responsibilities becomes more complex.

[^3-175]: See, for example, X.509.

[^3-176]: These doubts arise from a variety of legal doctrines. For example, there may be failure to form a contract with a relying party because of failure to communicate the terms of contract. Courts might refuse to enforce limitations of liability presented in certificates or elsewhere due to public policy concerns such as the reasonability of the limitation. Note that these concerns are more easily addressed in the so-called ‘two-corner’ issuance model, where a signatory self-certifies its identity and serves as its own certificate issuer. In the two-corner model there is no ‘third party’ and the signatory may have a direct relationship with the relying party more easily enabling the imposition of liability limits.

[^3-177]: Stephen Mason’s work in particular includes an extensive international catalogue of these laws \[<a href="#ref-237" aria-label="Reference 237">237</a>\].

[^3-178]: A similar analysis could apply in circumstances where enterprises order their members of staff to adopt and install trust certificates issued by the enterprise specifically to support SSL/TLS inspection. Such enterprises should consider the various types of liability that might arise as a result.

[^3-179]: States may also apply embargoes on most or all trade with specific states as part of a more general programme of sanctions.

[^3-180]: The precise status of software as speech for purposes of US free speech law remains somewhat murky. While US Federal courts seem willing to classify source code as protectable expression, they also appear to take its inherent functionality into account when assessing free speech rights. This in turn suggests that government intervention to restrict acts of distributing source code are more easily justified than restrictions on classic non-functional speech \[<a href="#ref-251" aria-label="Reference 251">251</a>, <a href="#ref-333" aria-label="Reference 333">333</a>, <a href="#ref-334" aria-label="Reference 334">334</a>\].

[^3-181]: The term ‘pubic international law’ is often referred to more simply as ‘international law’. By contrast, the field of ‘private international law’ describes the process of determining which domestic state law(s) will be applied to various aspects of private law disputes such as tort and contract actions. Aspects of private international law, or conflicts of law, are considered in this knowledge areas in the context of individual substantive legal subjects.

[^3-182]: In the referenced *Halford* case the complaining party successfully argued that the United Kingdom had failed to provide her with privacy rights required by the European Convention on Human Rights as regards interception of communications by state authorities \[<a href="#ref-133" aria-label="Reference 133">133</a>\]. This case precipitated the adoption by the UK of comprehensive legislation regulating the interception of communications.

[^3-183]: A notable exception involves prosecution according to the principles of international criminal law such as crimes against humanity.

[^3-184]: The process of creating the Tallinn Manual was not without controversy, and even the conclusions expressed in the ‘Rules’ (which represent unanimous consensus among the large expert group) are not universally agreed \[<a href="#ref-82" aria-label="Reference 82">82</a>, <a href="#ref-335" aria-label="Reference 335">335</a>\]. The Tallinn Manual itself helpfully provides extensive commentary that highlights circumstances where some states disagree with the unanimous views of the expert group, and other issues where the expert group itself did not achieve consensus. It is therefore not surprising that the Tallinn Manual 2.0 does not represent the official policy of the project’s sponsors (NATO \[North Atlantic Treaty Organization\] and its member states) or the various additional organisations whose experts participated in its creation and revision. Nonetheless, anecdotal evidence suggests that experts who advise all of these persons keep a copy of the Tallinn Manual close at hand and consult the work routinely.

[^3-185]: The term ‘attribution’ is often used in more than one sense. Practitioners should be careful to distinguish the legal doctrines used to analyse attribution from the process of collecting and presenting evidence intended to prove attribution. This section discusses only the former. The latter is more properly addressed in the field of forensics.

[^3-186]: The principle of territoriality and the exercise of state power is explored in the context of jurisdiction in Section 3.2

[^3-187]: Espionage during armed conflict is treated separately under the law of armed conflict. See, for example, (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.89.)

[^3-188]: See, for example, the discussion in Tallinn 2.0 of ‘herding’ target state communications to less secure infrastructure by interfering with more secure infrastructure (\[<a href="#ref-82" aria-label="Reference 82">82</a>\] at R.32, cmt.12).

[^3-189]: The qualifier ‘unrelated’ state is meant to distinguish circumstances where more than one sovereign state maintains concurrent jurisdiction over a single territory, as found in federal states.

[^3-190]: The term ‘law of war’ significantly predates the term ‘law of armed conflict’, but is now used less frequently especially as armed conflict often takes place in the absence of any formal declaration of war. ‘International humanitarian law’ (IHL) is a more recent term \[<a href="#ref-259" aria-label="Reference 259">259</a>\] at p.8, fn.5. The adoption and use of ‘IHL’ to describe this field is not without controversy \[<a href="#ref-336" aria-label="Reference 336">336</a>\].

[^3-191]: Although this should be obvious, the concept of ‘cyber attack’ used to discuss obligations under international law is significantly more narrow than the term ‘attack’ which is broadly defined for most other purposes in cyber security. Cyber security practitioners tend to use the term ‘attack’ to describe any effort to obtain unauthorised access to a system, resources, or information, or any malicious activity intended to collect, disrupt, deny, degrade, or destroy information system resources \[<a href="#ref-337" aria-label="Reference 337">337</a>\].

[^3-192]: In the case of offensive cyber operations undertaken at the direction of a state, compliance with ‘all applicable laws’ may indeed be impossible as the actions taken at the direction of a sponsoring state may constitute crimes under the domestic law of the target state. Similarly, in some circumstances a practitioner might complain that compliance with a legal obligation is, itself, ethically challenging \[<a href="#ref-338" aria-label="Reference 338">338</a>\]. This section does not attempt to resolve these issues.

[^3-193]: Practitioners should be mindful that if they are employed or engaged by a regulated professional firm (e.g., a legal, medical, or public accountancy firm) the practitioner may be obliged by applicable law to conform with the rules of the relevant regulated profession – especially on matters such client confidentiality or client’s legal privilege to prohibit the disclosure of sensitive information. These practitioners must become familiar with the obligations imposed by the regulations that apply to that firm.

[^3-194]: This discussion does not address circumstances where applicable law mandates disclosure of this evidence to identified third parties, such as the data breach disclosure requirements imposed by GDPR. In such cases, a practitioner should be careful to take appropriate advice concerning their individual legal reporting obligations as distinct from obligations imposed upon their client, and to urge their client to investigate the client’s own potential legal reporting obligations.

[^3-195]: Many early examples include mandates to ‘comply’ with the law, while others demand that a practitioner should ‘be aware’ of the law. Some include the concept of avoiding harm to others without discussing the subtleties of this proscription. Some speak of a general affirmative obligation to protect ‘society’, without identifying the nature of the obligation in practice, identifying the relevant society in cases where two societies are in conflict, or discussing the possible conflict between protecting society generally and a client individually. Some speak of obligations to protect ‘infrastructure’, without clarifying whose infrastructure is to be protected: public, private, first-party, third-party, domestic, or foreign. Many of these codes fail entirely to discuss specific obligations owed to a client and how to manage potential conflicts.

[^3-196]: CREST has subsequently added additional services to its certification process.

[^3-197]: See also Orin Kerr’s extensive discussions of ‘authorization’ in the context of US computer crime statutes \[<a href="#ref-176" aria-label="Reference 176">176</a>, <a href="#ref-177" aria-label="Reference 177">177</a>\].

[^3-198]: Some risks of disclosure might include the impracticability of patching or fixing the vulnerability. The benefits of secrecy might include a state security agency’s ability to exploit the given vulnerability.

[^3-199]: This is a special threat for finders engaged in academic security research who face normal academic pressure to publish research results \[<a href="#ref-315" aria-label="Reference 315">315</a>\].

[^3-200]: While disclosing a unique vulnerability in a single online service to a single effected firm is simple, disclosing a vulnerability in a complex supply chain presents special problems. Disclosing first to downstream producers of finished goods or services focuses the disclosure on those who appear to have the most at risk from security failure, but who may not have the tools necessary to mitigate the threat. This downstream disclosure also creates a risk of alienating the upstream developer of the component – especially if the vulnerability is misdescribed. In the field of academic security research in particular, researchers often depend on good continuing relationships with the developer community. Disclosing first to the upstream developer creates a challenge if that developer is dilatory in remediating the vulnerability. Finders in this situation might consider the potential for a multi-step private disclosure process starting (perhaps) with the upstream party most likely to be able to understand and remediate the threat. Having disclosed and then provided an opportunity for that party to analyse or rebut the claim of vulnerability, the finder might begin additional private disclosures one step at a time down the supply chain to those who might take action to mitigate the threat. Second-stage public disclosure would then become a last step of many.

[^3-201]: Commenting on a decision by academics to publish vulnerability details more than nine months after private disclosure to an upstream security component vendor, but in the face of strong objections by a downstream purchaser who incorporated the compromised security product into their mass-produced automobiles, an English high court Judge noted, ‘I think the defendants’ mantra of “responsible disclosure" is no such thing. It is a self-justification by defendants for the conduct they have already decided to undertake and it is not the action of responsible academics.’ *Megamos Crypto (Volkswagen v Garcia)*, Para 42 \[<a href="#ref-226" aria-label="Reference 226">226</a>, <a href="#ref-227" aria-label="Reference 227">227</a>\]. Note that the academics in the *Megamos Crypto* case claimed that they were adhering to then-current responsible disclosure procedures published by the National Cyber Security Centre of the Netherlands, the state in which they conducted the bulk of their research.

[^3-202]: While the mere presence of a vulnerability in a product or service does not necessarily constitute vendor negligence, vendors who receive a vulnerability report should consider that a failure to act in a reasonable fashion following receipt of such a report could constitute an independent act of negligence.

[^3-203]: Some have attempted to address this issue by adopting legislation that would regulate the disclosure process. One (as yet) unsuccessful attempt in Latvia is helpfully described in \[<a href="#ref-316" aria-label="Reference 316">316</a>\].

[^3-204]: An example likely to be familiar to practitioners was the fate of the Arthur Andersen accounting firm in the early 21st century. The firm was an adviser to the Enron Corporation, and was accused by the US government of improperly destroying evidence related to the Enron investigation. A federal jury returned a guilty verdict in the firm’s 2002 criminal trial \[<a href="#ref-339" aria-label="Reference 339">339</a>\]. Upon conviction, the firm was debarred from conducting public company audit work effectively ending its ability to operate as a going concern. The criminal conviction ultimately was overturned by the US supreme court in 2005 \[<a href="#ref-340" aria-label="Reference 340">340</a>\]. This came too late for the firm, which had ceased ongoing operations.

## References

- <span id="ref-73">\[73\]</span> J. Goldsmith and T. Wu, *Who Controls the Internet? Illusions of a Borderless World*. New York, NY: Oxford University Press, 2006.
- <span id="ref-77">\[77\]</span> C. Millard and R. Carolina, “Commercial transactions on the global information infrastructure: A European perspective,” *The John Marshall Journal of Information Technology & Privacy Law*, vol. 14, no. 2, pp. 269–301, 1996.
- <span id="ref-78">\[78\]</span> D. R. Johnson and D. Post, “Law and Borders–The Rise of Law in Cyberspace,” *Stanford Law Review*, vol. 48, pp. 1367–1402, 1996.
- <span id="ref-80">\[80\]</span> “Report of the Group of Governmental Experts on Developments in the Field of Information and Telecommunications in the Context of International Security,” Report A/68/98, United Nations General Assembly, 2013.
- <span id="ref-81">\[81\]</span> “Group of Governmental Experts on Developments in the Field of Information and Telecommunications in the Context of International Security,” Report A/70/174, United Nations General Assembly, 2015.
- <span id="ref-82">\[82\]</span> M. N. Schmitt, Ed., *Tallinn Manual 2.0 on the International Law Applicable to Cyber Warfare*. Cambridge University Press, 2017.
- <span id="ref-85">\[85\]</span> D. Rowland, U. Kohl, and A. Charlesworth, *Information Technology Law*, 5th ed. London: Routledge, 2017.
- <span id="ref-86">\[86\]</span> A. Murray, *Information Technology Law: the Law and Society*, 3rd ed. Oxford University Press, 2016.
- <span id="ref-87">\[87\]</span> I. Walden, *Computer Crimes and Digital Investigations*, 2nd ed. Oxford: Oxford University Press, 2016.
- <span id="ref-88">\[88\]</span> T. J. Holt, A. M. Bossler, and K. C. Seigfried-Spellar, *Cybercrime and Digital Forensics: An Introduction*, 2nd ed. Routledge: Taylor and Francis, 2018.
- <span id="ref-89">\[89\]</span> J. Clough, *Principles of Cybercrime*, 2nd ed. Cambridge University Press, 2015.
- <span id="ref-109">\[109\]</span> “Twentieth Century Fox and others v. British Telecommunications plc,” \[<a href="#ref-2011" aria-label="Reference 2011">2011</a>\] EWHC 1981, 2011.
- <span id="ref-113">\[113\]</span> “CASE NOTE: Privacy — Stored Communications Act — Second Circuit Holds That The Government Cannot Compel An Internet Service Provider To Produce Information Stored Overseas. — Microsoft Corp. v. United States, 829 F.3d 197 (2d Cir. 2016),” *Harvard Law Review*, vol. 130, pp. 769–776, 2016.
- <span id="ref-122">\[122\]</span> A. Chander and U. P. Lê, “Data Nationalism,” *Emory LJ*, vol. 64, pp. 677–739, 2014.
- <span id="ref-123">\[123\]</span> A. Savelyev, “[Russia’s new personal data localization regulations: A step forward or a self-imposed sanction?](https://doi.org/10.1016/j.clsr.2015.12.003)” *Comput. Law Secur. Rev.*, vol. 32, no. 1, pp. 128–145, 2016.
- <span id="ref-124">\[124\]</span> S. Livingston and G. Greenleaf, “Data localisation in China and other APEC jurisdictions,” *Privacy Laws & Business International Report*, vol. 143, pp. 22–26, 2016.
- <span id="ref-125">\[125\]</span> A. D. Mitchell and J. Hepburn, “Don’t Fence Me In: Reforming Trade and Investment Law to Better Facilitate Cross-Border Data Transfer,” *Yale JL & Tech.*, vol. 19, pp. 182–237, 2017.
- <span id="ref-133">\[133\]</span> “Halford v. The United Kingdom,” (20605/92) (\[<a href="#ref-1997" aria-label="Reference 1997">1997</a>\] 24 EHRR 523, 1997.
- <span id="ref-137">\[137\]</span> A. M. Rutkowski, “International Signals Intelligence Law: Provisions and History,” *Lawfare Research Paper Series*, vol. 42, pp. 933–988, 2017.
- <span id="ref-138">\[138\]</span> N. Jupillat, “From the Cuckoo’s Egg to Global Surveillance: Cyber Espionage that Becomes Prohibited Intervention,” *North Carolina Journal of International Law*, vol. 42, pp. 933–988, 2016.
- <span id="ref-148">\[148\]</span> “Handbook on European data protection law,” European Union Agency for Fundamental Rights, 2018.
- <span id="ref-149">\[149\]</span> GDPR: guidelines, recommendations, best practices. European Data Protection Board. [Online]. Available: [online copy of reference 149](https://www.edpb.europa.eu/documents_en?keys=GDPR%20Guidelines%20Recommendations%20Best%20Practice)
- <span id="ref-160">\[160\]</span> “In re Nickelodeon Consumer Privacy Litig.” 827 F.3d 262, 278 (3d Cir. 2016), *cert denied*, 137 S.Ct. 624 (2017), 2016.
- <span id="ref-161">\[161\]</span> “Eichenberger v. ESPN, Inc.” 876 F.3d 979 (9th Cir.), 2017.
- <span id="ref-176">\[176\]</span> O. S. Kerr, “Cybercrime’s Scope: Interpreting Access and Authorization in Computer Misuse Statutes,” *New York University Law Review*, vol. 78, pp. 1596–1668, 2003.
- <span id="ref-177">\[177\]</span> ——, “Norms of Computer Trespass,” *Columbia Law Review*, vol. 116, no. 4, pp. 1143–1184, 2016.
- <span id="ref-178">\[178\]</span> “United States v. Nosal (*Nosal II*),” 844 F.3d 1024 (9th Cir.), 2016.
- <span id="ref-179">\[179\]</span> “United States v. Drew,” 259 FRD 449 (C.D. Cal.), 2009.
- <span id="ref-184">\[184\]</span> S. Curry, “[Hack-Back: Vigilantism In The Connected World](https://www.forbes.com/sites/samcurry/2019/01/07/hack-back-vigilantism-in-the-connected-world/#379ca3a55437),” *Forbes*, 7 January 2019.
- <span id="ref-185">\[185\]</span> (2019) Should Companies Risk Going on the Cyber Offensive? Brink. [Online]. Available: [online copy of reference 185](http://www.brinknews.com/should-companies-risk-going-on-the-cyber-offensive/)
- <span id="ref-187">\[187\]</span> “Directive 2000/31/EC of the European Parliament and of the Council of 8 June 2000 on certain legal aspects of information society services, in particular electronic commerce, in the Internal Market (Directive on electronic commerce),” *Official Journal of the European Communities*, vol. L 178, pp. 1–16, 2000.
- <span id="ref-189">\[189\]</span> “Directive (EU) 2015/2366 Of The European Parliament And Of The Council of 25 November 2015 on payment services in the internal market, amending Directives 2002/65/EC, 2009/110/EC and 2013/36/EU and Regulation (EU) No 1093/2010, and repealing Directive 200,” *Official Journal of the European Communities*, vol. L 337, pp. 35–127, 2015.
- <span id="ref-190">\[190\]</span> “Uniform Commercial Code, Article 4A,” The American Law Institute and the National Conference of Commissioners on Uniform State Laws.
- <span id="ref-191">\[191\]</span> “Regulation (EC) No 593/2008 of the European Parliament and of the Council of 17 June 2008 on the law applicable to contractual obligations (Rome I),” *Official Journal of the European Communities*, vol. L 177, pp. 6–16, 2008.
- <span id="ref-196">\[196\]</span> “United States v. Caroll Towing,” 159 F.2d 169, 2d Cir., 1947.
- <span id="ref-206">\[206\]</span> “Regulation (EC) No 864/2007 of the European Parliament and of the Council of 11 July 2007 on the law applicable to non-contractual obligations (Rome II),” *Official Journal of the European Union*, vol. L 199, pp. 40–49, 2007.
- <span id="ref-207">\[207\]</span> “WIPO Copyright Treaty,” World Intellectual Property Organization, Geneva, 1996.
- <span id="ref-208">\[208\]</span> S. P. Calandrillo and E. M. Davison, “The Dangers of the Digital Millennium Copyright Act: Much Ado about Nothing,” *William and Mary Law Review*, vol. 50, pp. 349–415, 2008.
- <span id="ref-209">\[209\]</span> A. J. Menezes, P. C. Van Oorschot, and S. A. Vanstone, *Handbook of applied cryptography*. CRC press, 1997.
- <span id="ref-210">\[210\]</span> G. Vetter, “Patenting Cryptographic Technology,” *Chicago-Kent Law Review*, vol. 84, pp. 757–776, 2009.
- <span id="ref-211">\[211\]</span> L. Khansa and C. W. Zobel, “[Assessing innovations in cloud security](https://doi.org/10.1080/08874417.2014.11645703),” *J. Comput. Inf. Syst.*, vol. 54, no. 3, pp. 45–56, 2014.
- <span id="ref-212">\[212\]</span> T. L. James, L. Khansa, D. F. Cook, O. Bruyaka, and K. B. Keeling, “[Using network-based text analysis to analyze trends in microsoft’s security innovations](https://doi.org/10.1016/j.cose.2013.02.004),” *Comput. Secur.*, vol. 36, pp. 49–67, 2013.
- <span id="ref-213">\[213\]</span> “Uniform Trade Secrets Act,” Uniform Law Commission, National Conference of Commissioners on Uniform State Laws, 1985.
- <span id="ref-214">\[214\]</span> J. H. Pooley, M. A. Lemley, and P. J. Toren, “Understanding the Economic Espionage Act of 1996,” *Tex. Intell. Prop. LJ*, vol. 5, pp. 177–229, 1996.
- <span id="ref-215">\[215\]</span> “Directive (EU) 2016/943 of the European Parliament and of the Council of 8 June 2016 on the protection of undisclosed know-how and business information (trade secrets) against their unlawful acquisition, use and disclosure,” *Official Journal of the European Union*, vol. L 157, pp. 1–18, 2016.
- <span id="ref-216">\[216\]</span> PricewaterhouseCoopers, “The scale and impact of industrial espionage and theft of trade secrets through cyber,” European Commission, 2018.
- <span id="ref-217">\[217\]</span> D. S. Levine and C. B. Seaman, “The DTSA at One: An Empirical Study of the First Year of Litigation Under the Defend Trade Secrets Act,” *Wake Forest Law Review*, vol. 53, pp. 105–156, 2018.
- <span id="ref-218">\[218\]</span> J. Lane, “NTP, Inc. v. Research in Motion, Ltd.: Inventions Are Global, But Politics Are Still Local-An Examination of the BlackBerry Case,” *Berkeley Tech. LJ*, vol. 21, pp. 59–77, 2006.
- <span id="ref-219">\[219\]</span> P. Samuelson and S. Scotchmer, “The Law and Economics of Reverse Engineering,” *Yale Law Journal*, vol. 111, pp. 1575–1663, 2002.
- <span id="ref-220">\[220\]</span> P. J. Weiser, “The Internet, Innovation, and Intellectual Property Policy,” *Columbia Law Review*, vol. 103, pp. 534–613, 2003.
- <span id="ref-221">\[221\]</span> P. Samuelson, “Anticircumvention Rules: Threat to Science,” *Science*, vol. 293, no. 5537, pp. 2028–2031, 2001.
- <span id="ref-222">\[222\]</span> C. Zieminski, “Game Over for Reverse Engineering: How the DMCA and Contracts Have Affected Innovation,” *Journal of Technology Law & Policy*, vol. 13, pp. 289–339, 2008.
- <span id="ref-223">\[223\]</span> “Directive 2009/24/EC of the European Parliament and of the Council of 23 April 2009 on the legal protection of computer programs,” *Official Journal of the European Union*, vol. L 111, pp. 16–22, 2009.
- <span id="ref-224">\[224\]</span> P. Samuelson, “Freedom to Tinker,” *Theoretical Inquiries in Law*, vol. 17, no. 2, pp. 562–600, 2016.
- <span id="ref-225">\[225\]</span> R. Verdult and F. D. Garcia, “[Cryptanalysis of the megamos crypto automotive immobilizer](https://www.usenix.org/publications/login/dec15/verdult),” *login Usenix Mag.*, vol. 40, no. 6, 2015.
- <span id="ref-226">\[226\]</span> “Volkswagen Aktiengesellschaft vs Garcia, et al,” \[<a href="#ref-2013" aria-label="Reference 2013">2013</a>\] EWHC 1832 (Ch), 2013.
- <span id="ref-227">\[227\]</span> R. Carolina and K. G. Paterson. (2013) Megamos Crypto, Responsible Disclosure, and the Chilling Effect of Volkswagen Aktiengesellschaft vs Garcia, et al. [Online]. Available: [online copy of reference 227](https://web.archive.org/web/20211019214015/http://www.origin.co.uk/download/43/)>
- <span id="ref-228">\[228\]</span> R. Verdult, F. D. Garcia, and B. Ege, “[Dismantling megamos crypto: Wirelessly lockpicking a vehicle immobilizer](https://www.usenix.org/conference/usenixsecurity15/technical-sessions/presentation/verdult),” in *Proceedings of the 22th USENIX Security Symposium, Washington, DC, USA, August 14-16, 2013*, S. T. King, Ed. USENIX Association, 2013, pp. 703–718.
- <span id="ref-229">\[229\]</span> “Berne Convention for the Protection of Literary and Artistic Works (as amended on September 28, 1979),” 1979.
- <span id="ref-230">\[230\]</span> “Prince plc v. Prince Sports Groups,” \[<a href="#ref-1998" aria-label="Reference 1998">1998</a>\] F.S.R. 21, 1998.
- <span id="ref-231">\[231\]</span> G. Sartor, “Providers Liability: From the eCommerce Directive to the Future,” European Parliament, 2017.
- <span id="ref-232">\[232\]</span> K. Perset, “The Economic and Social Role of Internet Intermediaries,” *OECD, Directorate for Science, Technology and Industry, OECD Digital Economy Papers*, 2010.
- <span id="ref-233">\[233\]</span> T. Verbiest, G. Spindler, and G. M. Riccio. (2007) Study on the liability of internet intermediaries. [Online]. Available: [online copy of reference 233](http://dx.doi.org/10.2139/ssrn.2575069)
- <span id="ref-234">\[234\]</span> M. B. Kaya, “The regulation of Internet intermediaries under Turkish law: Is there a delicate balance between rights and obligations?” *Computer Law & Security Review*, vol. 33, p. 759–774, 2017.
- <span id="ref-235">\[235\]</span> “UNCITRAL Model Law on Electronic Commerce with Guide to Enactment 1996 with additional article 5 bis as adopted in 1998,” United Nations, 1999.
- <span id="ref-236">\[236\]</span> A. M. Froomkin, “The Essential Role of Trusted Third Parties in Electronic Commerce,” *Oregon Law Review*, vol. 75, pp. 49–115, 1996.
- <span id="ref-237">\[237\]</span> S. Mason, *Electronic Signatures in Law*, 4th ed. University of London, School of Advanced Study, Institute of Advanced Legal Studies, 2017.
- <span id="ref-238">\[238\]</span> “Digital Signature Guidelines: Legal Infrastructure for Certification Authorities and Secure Electronic Commerce,” American Bar Association, 1996.
- <span id="ref-239">\[239\]</span> “Directive 1999/93/EC of the European Parliament and of the Council of 13 December 1999 on a Community framework for electronic signatures,” *Official Journal of the European Union*, vol. L 13, pp. 12–20, 1999.
- <span id="ref-240">\[240\]</span> “Regulation (EU) No 910/2014 of the European Parliament and of the Council of 23 July 2014 on electronic identification and trust services for electronic transactions in the internal market and repealing Directive 1999/93/EC,” *Official Journal of the European Union*, vol. L 257, pp. 73–114, 2014.
- <span id="ref-241">\[241\]</span> S. Room, *Butterworths Data Security Law & Practice*. LexisNexis, 2009.
- <span id="ref-242">\[242\]</span> D. W. Arner, J. Barberis, and R. P. Buckey, “FinTech, RegTech, and the Reconceptualization of Financial Regulation,” *Northwestern Journal of International Law & Business*, vol. 37, pp. 371–414, 2017.
- <span id="ref-243">\[243\]</span> M. G. Porcedda, “[Patching the patchwork: appraising the EU regulatory framework on cyber security breaches](https://doi.org/10.1016/j.clsr.2018.04.009),” *Comput. Law Secur. Rev.*, vol. 34, no. 5, pp. 1077–1098, 2018.
- <span id="ref-244">\[244\]</span> “Directive (EU) 2016/1148 of the European Parliament and of the Council of 6 July 2016 concerning measures for a high common level of security of network and information systems across the Union,” *Official Journal of the European Union*, vol. L 194, pp. 1–30, 2016.
- <span id="ref-245">\[245\]</span> “The Network and Information Systems Regulations 2018,” S.I. 2018 No 506, 2018.
- <span id="ref-246">\[246\]</span> D. Thaw, “The Efficacy of Cybersecurity Regulation,” *Georgia State University Law Review*, vol. 30, pp. 287–374, 2014.
- <span id="ref-247">\[247\]</span> “Regulation (EU) 2019/881 of the European Parliament and of the Council of 17 April 2019 on ENISA (the European Union Agency for Cybersecurity) and on information and communications technology cybersecurity certification and repealing Regulation (EU) No 526/2013 (Cybersecurity Act),” *Official Journal of the European Union*, vol. L 151, pp. 15–69, 2017.
- <span id="ref-248">\[248\]</span> “Code of Practice for Consumer IoT Security,” UK Government: Department for Digital, Culture, Media & Sport, 2018.
- <span id="ref-249">\[249\]</span> “TS 103 645 V1.1.1 Cyber Security for Consumer Internet of Things,” ETSI, 2019.
- <span id="ref-250">\[250\]</span> “Junger v. Daley,” 209 F.3d 481 (6th Cir.), 2000.
- <span id="ref-251">\[251\]</span> J. R. Roig, “Decoding First Amendment Coverage of Computer Source Code in the Age of YouTube, Facebook, and the Arab Spring,” *N.Y.U. Annual Survey of American Law*, vol. 68, pp. 319–395, 2012.
- <span id="ref-252">\[252\]</span> “[Cyber and International Law in the 21st Century](https://www.gov.uk/government/speeches/cyber-and-international-law-in-the-21st-century),” Speech delivered at Chatham House, Royal Institute for International Affairs, Attorney General of the UK, Jeremy Wright, QC, MP, 23 May 2018.
- <span id="ref-253">\[253\]</span> I. Y. Liu, “[The due diligence doctrine under tallinn manual 2.0](https://doi.org/10.1016/j.clsr.2017.03.023),” *Comput. Law Secur. Rev.*, vol. 33, no. 3, pp. 390–395, 2017.
- <span id="ref-254">\[254\]</span> C. Lotrionte, “Countering State-Sponsored Cyber Economic Espionage under International Law,” *North Carolina Journal of International Law and Commercial Regulation*, vol. 40, no. 2, pp. 443–542, 2015.
- <span id="ref-255">\[255\]</span> ——, “Reconsidering the Consequences for State-Sponsored Hostile Cyber Operations Under International Law,” *The Cyber Defense Review*, vol. 3, no. 2, pp. 73–144, 2018.
- <span id="ref-256">\[256\]</span> M. Libicki, “[The coming of cyber espionage norms](https://doi.org/10.23919/CYCON.2017.8240325),” in *9th International Conference on Cyber Conflict, CyCon 2017, Tallinn, Estonia, May 30 - June 2, 2017*. IEEE, 2017, pp. 1–17.
- <span id="ref-257">\[257\]</span> “The Joint Service Manual of the Law of Armed Conflict,” Joint Service Publication 383, UK Ministry of Defence, 2004.
- <span id="ref-258">\[258\]</span> “Department of Defense Law of War Manual,” US Department of Defense, December 2016.
- <span id="ref-259">\[259\]</span> “Law of Armed Conflict Deskbook,” International and Operational Law Department, the United States Army Judge Advocate General’s Legal Center and School (TJAGLCS), 2015.
- <span id="ref-260">\[260\]</span> P. Pascucci, “Distinction and Proportionality in Cyberwar: Virtual Problems with a Real Solution,” *Minnesota Journal of International Law*, vol. 26, no. 2, pp. 419–460, 2017.
- <span id="ref-261">\[261\]</span> M. Dark, R. Epstein, L. Morales, T. Countermine, Q. Yuan, M. Ali, M. Rose, and N. Harter, “A Framework for Information Security Ethics Education,” in *10th Colloquium for Information Systems Security Education-University of Maryland*, vol. 4, 2006, pp. 109–115.
- <span id="ref-262">\[262\]</span> ACM History. Association for Computing Machinery. [Online]. Available: [online copy of reference 262](https://www.acm.org/about-acm/acm-history)
- <span id="ref-263">\[263\]</span> “ACM Code of Ethics and Professional Conduct,” Association for Computing Machinery, 2018.
- <span id="ref-264">\[264\]</span> Using the Code. Association for Computing Machinery. [Online]. Available: [online copy of reference 264](https://ethics.acm.org/code-of-ethics/using-the-code/)
- <span id="ref-265">\[265\]</span> (2019) Accredited Companies - Regions and Services. Crest (International). [Online]. Available: [online copy of reference 265](https://web.archive.org/web/20190722232522/https://www.crest-approved.org/accredited-companies/index.html)>
- <span id="ref-266">\[266\]</span> “CREST Code of Conduct for CREST Qualified Individuals (version 8.0),” Crest (GB) Ltd., 2016.
- <span id="ref-267">\[267\]</span> A. M. Matwyshyn, A. Cui, A. D. Keromytis, and S. J. Stolfo, “[Ethics in security vulnerability research](https://doi.org/10.1109/MSP.2010.67),” *IEEE Secur. Priv.*, vol. 8, no. 2, pp. 67–72, 2010.
- <span id="ref-268">\[268\]</span> A. Maurushat, *[Disclosure of Security Vulnerabilities - Legal and Ethical Issues](http://www.springer.com/computer/general+issues/book/978-1-4471-5003-9)*, ser. Springer Briefs in Cybersecurity. Springer, 2013.
- <span id="ref-269">\[269\]</span> “[The Equities Process](https://www.gchq.gov.uk/information/equities-process),” National Cyber Security Centre (UK), 2018.
- <span id="ref-270">\[270\]</span> “[Responsible Release Principles for Cyber Security Vulnerabilities](https://www.asd.gov.au/about/accountability-governance/publications/responsible-release-principles-cyber-security-vulnerabilities),” Australian Signals Directorate, 2019.
- <span id="ref-271">\[271\]</span> “[Vulnerabilities Equities Process (*redacted version disclosed 2016 under FOIA)*](https://www.eff.org/files/2016/01/18/37-3_vep_2016.pdf),” National Security Agency (US).
- <span id="ref-272">\[272\]</span> (2019) EFF v. NSA, ODNI - Vulnerabilities FOIA. Electronic Frontier Foundation. [Online]. Available: [online copy of reference 272](https://www.eff.org/cases/eff-v-nsa-odni-vulnerabilities-foia)
- <span id="ref-273">\[273\]</span> N. Asokan, “Ethics in Information Security,” *IEEE Security & Privacy*, May/June 2017.
- <span id="ref-274">\[274\]</span> “[Bug Bounties: Working Towards a Fairer and Safer Marketplace](https://www.crest-approved.org/wp-content/uploads/2022/04/CREST-Bug-Bounties-2018.pdf),” CREST, 2018.
- <span id="ref-275">\[275\]</span> M. Goldstein, A. Stevenson, and L. Picker, “Hedge Fund and Cybersecurity Firm Team Up to Short-Sell Device Maker,” *The New York Times*, 8 September 2016.
- <span id="ref-276">\[276\]</span> “ISO/IEC 29147:2014 Information Technology - Security techniques - Vulnerability disclosures,” 2014.
- <span id="ref-277">\[277\]</span> “ISO/IEC 30111:2013 Information technology - Security techniques - Vulnerability handling processes,” 2013.
- <span id="ref-278">\[278\]</span> “Coordinated Vulnerability Disclosure: the Guideline,” National Cyber Security Centre (NL), 2018.
- <span id="ref-279">\[279\]</span> “[NCSC vulnerability disclosure co-ordination](https://www.ncsc.gov.uk/blog-post/ncsc-vulnerability-disclosure-co-ordination),” National Cyber Security Centre (UK), 2018.
- <span id="ref-311">\[311\]</span> M. Perrow. (2009) Click’s botnet experiment. [Online]. Available: [online copy of reference 311](https://www.bbc.co.uk/blogs/theeditors/2009/03/click_botnet_experiment.html)
- <span id="ref-312">\[312\]</span> R. Carolina. (2009) Opinion: The unanticipated consequences of BBC Click’s botnet crime. [Online]. Available: [online copy of reference 312](https://www.computerweekly.com/opinion/Opinion-The-unanticipated-consequences-of-BBC-Clicks-botnet-crime)
- <span id="ref-313">\[313\]</span> ——. (2009) Opinion: BBC Click exploited world’s poor and vulnerable. [Online]. Available: [online copy of reference 313](https://www.computerweekly.com/opinion/Opinion-BBC-Click-exploited-worlds-poor-and-vulnerable)
- <span id="ref-315">\[315\]</span> D. Etcovitch and T. van der Merwe, “Coming in from the Cold: A Safe Harbor from the CFAA and the DMCA §1201 for Security Researchers,” Research Publication No. 2018-4, Berkman Klein Center, 2018.
- <span id="ref-316">\[316\]</span> U. Kinis, “[From responsible disclosure policy (RDP) towards state regulated responsible vulnerability disclosure procedure (hereinafter - RVDP): the latvian approach](https://doi.org/10.1016/j.clsr.2017.11.003),” *Comput. Law Secur. Rev.*, vol. 34, no. 3, pp. 508–522, 2018.
- <span id="ref-320">\[320\]</span> N. E. Vellinga, “[From the testing to the deployment of self-driving cars: Legal challenges to policymakers on the road ahead](https://doi.org/10.1016/j.clsr.2017.05.006),” *Comput. Law Secur. Rev.*, vol. 33, no. 6, pp. 847–863, 2017.
- <span id="ref-321">\[321\]</span> T. Mackie, “[Proving liability for highly and fully automated vehicle accidents in australia](https://doi.org/10.1016/j.clsr.2018.09.002),” *Comput. Law Secur. Rev.*, vol. 34, no. 6, pp. 1314–1332, 2018.
- <span id="ref-325">\[325\]</span> F. D. Prager, “The Influence of Mr. Justice Story on American Patent Law,” *The American Journal of Legal History*, vol. 5, pp. 254–264, 1961.
- <span id="ref-326">\[326\]</span> “Ungar v. Sugg,” (1892) 9 RPC 113, 1892.
- <span id="ref-327">\[327\]</span> C. Yang, “[The BlackBerry Widow’s Tale](https://www.bloomberg.com/news/articles/2005-12-18/the-blackberry-widows-tale),” *Bloomberg*, 18 December 2005.
- <span id="ref-328">\[328\]</span> P. Samuelson, “Intellectual Property and the Digital Economy: Why the Anti-circumvention Regulations Need to be Revised,” *Berkley Technology Law Journal*, vol. 14, pp. 519–566, 1999.
- <span id="ref-329">\[329\]</span> “Haberman v. Jackel International,” \[<a href="#ref-1999" aria-label="Reference 1999">1999</a>\] FSR 683, 1999.
- <span id="ref-330">\[330\]</span> (2019) Woodhull Freedom Foundation et al. v. United States. Electronic Frontier Foundation. [Online]. Available: [online copy of reference 330](https://www.eff.org/cases/woodhull-freedom-foundation-et-al-v-united-states)
- <span id="ref-331">\[331\]</span> R. Romano. (2019) A new law intended to curb sex trafficking threatens the future of the internet as we know it. [Online]. Available: [online copy of reference 331](https://www.vox.com/culture/2018/4/13/17172762/fosta-sesta-backpage-230-internet-freedom)
- <span id="ref-332">\[332\]</span> S. Mason, “[Documents signed or executed with electronic signatures in english law](https://doi.org/10.1016/j.clsr.2018.05.023),” *Comput. Law Secur. Rev.*, vol. 34, no. 4, pp. 933–945, 2018.
- <span id="ref-333">\[333\]</span> J. E. Cohen, “The Zombie First Amendment,” *William and Mary Law Review*, vol. 56, pp. 1119–1158, 2015.
- <span id="ref-334">\[334\]</span> B. Lee, “Where Gutenberg Meets Guns: The Liberator, 3D-printed Weapons, and the First Amendment,” *North Carolina Law Review*, vol. 92, pp. 1393–1425, 2014.
- <span id="ref-335">\[335\]</span> E. T. Jensen, “The Tallinn Manual 2.0: Highlights and Insights,” *Georgetown Journal of International Law*, vol. 48, pp. 735–778, 2016.
- <span id="ref-336">\[336\]</span> P. Wilson, “The myth of international humanitarian law,” *International Affairs*, vol. 93, no. 3, pp. 563–579, 2017.
- <span id="ref-337">\[337\]</span> “Glossary of Key Information Security Terms,” NISTIR 7298 (revision 2), National Institute of Standards and Technology, 2013.
- <span id="ref-338">\[338\]</span> J. Markoff, “Apple’s Engineers, if Defiant, Would be in Sync With Ethics Code,” *The New York Times*, 18 March 2016.
- <span id="ref-339">\[339\]</span> “United States v. Arthur Andersen LLP,” 374 F.3d 281 (5th Cir), *reversed by* \[<a href="#ref-340" aria-label="Reference 340">340</a>\], 2004.
- <span id="ref-340">\[340\]</span> “Arthur Andersen LLP v. United States,” 544 U.S. 696 (US S.Ct), 2005.
