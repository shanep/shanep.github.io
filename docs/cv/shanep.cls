% (c) 2002 Matthew Boedicker <mboedick@mboedick.org> (original author) http://mboedick.org
% (c) 2003 David J. Grant <dgrant@ieee.org> http://www.davidgrant.ca
% (c) 2007 Todd C. Miller <Todd.Miller@courtesan.com> http://www.courtesan.com/todd
% (c) 2009 Derek R. Hildreth <derek@derekhildreth.com>
% (c) 2013 Shane K. Panter https://shanepanter.com
%
% This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike License. To
% view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/1.0/ or send a
% letter to Creative Commons, 559 Nathan Abbott Way, Stanford, California 94305, USA.
%
%GENERAL NOTE: There may be some notes specific to myself.  If you're only interested in my LaTeX
% source or it doesn't make sense, please disregard it.


\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{shanep}[2024/04/03 Shane Panter CV]

\LoadClass[12pt]{article}

\RequirePackage{latexsym}
\RequirePackage[empty]{fullpage}
\RequirePackage{xcolor}
\RequirePackage{verbatim}
\RequirePackage{graphicx}
\RequirePackage{multirow}
\RequirePackage{hyperref}
\RequirePackage[backend=biber, style=alphabetic, maxbibnames=99]{biblatex}

\nocite{*}

\renewcommand*{\mkbibnamegiven}[1]{%
  \ifitemannotation{highlight}
  {\textbf{#1}}
  {#1}}



\renewcommand*{\mkbibnamefamily}[1]{%
  \ifitemannotation{highlight}
                   {\textbf{#1}}
                   {#1}}

\urlstyle{same}

\textheight=9.0in
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Adjust margins
\addtolength{\oddsidemargin}{-0.375in}
\addtolength{\evensidemargin}{0.375in}
\addtolength{\textwidth}{0.5in}
\addtolength{\topmargin}{-.375in}
\addtolength{\textheight}{0.75in}

\newcommand{\resheading}[1]{{
    \large
    \colorbox{lightgray}{
      \begin{minipage}{\textwidth}{
          \textbf{#1}}
      \end{minipage}
    }
  }
}

\newcommand{\ressubheading}[5]{
\item[]
  \begin{tabular*}{6.5in}{l@{\hspace{.1in}} l@{\extracolsep{\fill}}r}
    \multirow{2}{1in}{#1} & \textbf{#2} & #3 \\
    & \textit{#4} & \textit{#5} \\
  \end{tabular*}
  \vspace{-6pt}
}

\newcommand{\resitem}[1]{\item #1 \vspace{-2pt}}

\newcommand{\mywebheader}[3]{
  \begin{tabular*}{7in}{l@{\extracolsep{\fill}}r}
    \textbf{\huge #2}
    & \href{mailto:#3}{#3}\\
    & \href{#1} {#1} \\
  \end{tabular*}
  \\
  \vspace{0.1in}}
