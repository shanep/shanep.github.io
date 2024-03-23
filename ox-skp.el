;;; ox-skp.el --- Custom export for shanepanter.com -*- lexical-binding:t -*-

;; Copyright (C) 2024  Shane K. Panter

;; Author: Shane K. Panter <shane@foundationcode.com>
;; Version: 1.0.0
;; Keywords: orgmode export
;; URL: https://github.com/shanep/shanep.github.io

;; Package-Requires: ((emacs "29.0"))
;;

;; This program is free software; you can redistribute it and/or modify
;; it under the terms of the GNU General Public License as published by
;; the Free Software Foundation, either version 3 of the License, or
;; (at your option) any later version.

;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.

;; You should have received a copy of the GNU General Public License
;; along with this program.  If not, see <https://www.gnu.org/licenses/>.

;;; Commentary:

;; Custom export for my personal website

;;; Code:

(require 'cl-lib)
(require 'ox-html)

(defun skp-add-two (a b)
  "Test add function for A and B."
  (+ a b))

(org-export-define-derived-backend 'skp-html 'html
  :menu-entry '(?h 1
		   ((?s "As HTML file (SKP Style)" skp-org-html-export-to-html )))
  :translate-alist '((template . skp-org-site-template)))

;;;###autoload
(defun skp-org-html-export-to-html
    (&optional async subtreep visible-only body-only ext-plist)
  "Export current buffer as an HTML File.

If narrowing is active in the current buffer, only export its
narrowed part.

If a region is active, export that region.

A non-nil optional argument ASYNC means the process should happen
asynchronously.  The resulting file should be accessible through
the `org-export-stack' interface.

When optional argument SUBTREEP is non-nil, export the sub-tree
at point, extracting information from the headline properties
first.

When optional argument VISIBLE-ONLY is non-nil, don't export
contents of hidden elements.

When optional argument BODY-ONLY is non-nil, only write code
between \"\\begin{document}\" and \"\\end{document}\".

EXT-PLIST, when provided, is a property list with external
parameters overriding Org default settings, but still inferior to
file-local settings.

Return output file's name."
  (interactive)
  (org-html-export-to-html async subtreep visible-only body-only ext-plist)
  (let ((file (org-export-output-file-name ".html" subtreep)))
    (org-export-to-file 'skp-html file
      async subtreep visible-only body-only ext-plist)))


(defun skp-org-site-template (contents info)
  "Return the complete docuemnt string after HTML conversion.
CONTENTS is the transcoded contents string.  INFO is a plist
holding export options."
  (concat
   (org-html-doctype info)
   "<html lang=\"" (plist-get info :language)"\">\n"
   "<head>\n"
   (org-html--build-meta-info info)
   (org-html--build-head info)
   "</head>\n"
   "<body>\n"
   "<nav>\n"
   (org-html--build-pre/postamble 'preamble info)
   "</nav>\n"

   "<header>\n"
   (format "<h1> %s </h1>\n" (org-export-data (plist-get info :title) info))
   "</header>\n"

   "<main>"
   "<article>"
   contents
   "</article>"
   "</pmain>\n"
   "</body>\n"
   "</html>\n"))

;;;###autoload
(defun skp-org-html-publish-to-html (plist filename pub-dir)
  "Publish an org file to HTML.

FILENAME is the filename of the Org file to be published.  PLIST
is the property list for the given project.  PUB-DIR is the
publishing directory.

Return output file name."
  (org-publish-org-to 'skp-html filename
		      (concat (when (> (length org-html-extension) 0) ".")
			      (or (plist-get plist :html-extension)
				  org-html-extension
				  "html"))
		      plist pub-dir))



(provide 'ox-skp)

;;; ox-skp.el ends here
