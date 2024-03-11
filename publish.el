;;; publish.el --- Publishing config for website        -*- lexical-binding: t; -*-

;;; Commentary:
;;

;;; Code:

(require 'ox-publish)


(defun my-org-publish-sitemap-entry (entry style project)
  "Default format for site map ENTRY, as a string.
ENTRY is a file name.  STYLE is the style of the sitemap.
PROJECT is the current project."
  (cond ((not (directory-name-p entry))
	 (if (not (string= entry "index.org"))
	     (format "[%s] - [[file:%s][%s]]"
		   (format-time-string "%D" (org-publish-find-date entry project))
		   entry
		   (org-publish-find-title entry project))
	   "delete"))
	((eq style 'tree)
	 (file-name-nondirectory (directory-file-name entry)))
	(t entry)))

(defun my-org-publish-sitemap (title list)
  "Default site map, as a string.
TITLE is the title of the site map.  LIST is an internal
representation for the files to include, as returned by
`org-list-to-lisp'.  PROJECT is the current project."
  (setcdr list
	  (let (value)
	    (dolist (elt (cdr list) value)
	      (unless (string= "delete" (car elt))
		(setq value (cons elt value))))))
  (concat "#+TITLE: " title "\n\n"
	  (org-list-to-org list)))

(customize-set-variable 'org-publish-project-alist
			`(("index"
			   :base-directory ,(concat (vc-root-dir)  "org/")
			   :base-extension "org"
			   :publishing-directory ,(concat (vc-root-dir) "build/")
			   :publishing-function org-html-publish-to-html)

			  ("cs117"
			   :base-directory ,(concat (vc-root-dir)  "org/cs117")
			   :base-extension "org"
			   :recursive t
			   :publishing-directory ,(concat (vc-root-dir) "build/cs117")
			   :publishing-function org-html-publish-to-html
			   :html-postamble "<ul><li>Author: %a (%e)</li><li>Date: %d</li><li>Exported: %T</li><li>%v</li></ul>")

			  ("cs155"
			   :base-directory ,(concat (vc-root-dir)  "org/cs155")
			   :base-extension "org"
			   :recursive t
			   :publishing-directory ,(concat (vc-root-dir) "build/cs155")
			   :publishing-function org-html-publish-to-html
			   :html-postamble "<ul><li>Author: %a (%e)</li><li>Date: %d</li><li>Exported: %T</li><li>%v</li></ul>")

			  ("cs333"
			   :base-directory ,(concat (vc-root-dir)  "org/cs333")
			   :base-extension "org"
			   :recursive t
			   :publishing-directory ,(concat (vc-root-dir) "build/cs333")
			   :publishing-function org-html-publish-to-html
			   :html-postamble "<ul><li>Author: %a (%e)</li><li>Date: %d</li><li>Exported: %T</li><li>%v</li></ul>")

			  ("cs408"
			   :base-directory ,(concat (vc-root-dir)  "org/cs408")
			   :base-extension "org"
			   :recursive t
			   :publishing-directory ,(concat (vc-root-dir) "build/cs408")
			   :publishing-function org-html-publish-to-html
			   :html-postamble "<ul><li>Author: %a (%e)</li><li>Date: %d</li><li>Exported: %T</li><li>%v</li></ul>")

			  ("teaching"
			   :base-directory ,(concat (vc-root-dir)  "org/teaching")
			   :base-extension "org"
			   :recursive t
			   :auto-sitemap t
			   :sitemap-title ""
			   :sitemap-filename "sitemap.org"
			   :sitemap-sort-files chronologically
			   :sitemap-format-entry my-org-publish-sitemap-entry
			   :sitemap-function my-org-publish-sitemap
			   :publishing-directory ,(concat (vc-root-dir) "build/teaching")
			   :publishing-function org-html-publish-to-html
			   :html-postamble "<ul><li>Author: %a (%e)</li><li>Date: %d</li><li>Exported: %T</li><li>%v</li></ul>")

			  ("teaching-images"
			   :base-directory ,(concat (vc-root-dir)  "org/teaching/images")
			   :base-extension "jpg\\|gif\\|png"
			   :publishing-directory ,(concat (vc-root-dir) "build/teaching/images")
			   :publishing-function org-publish-attachment)

			  ("research"
			   :base-directory ,(concat (vc-root-dir)  "org/research")
			   :base-extension "org"
			   :recursive t
			   :auto-sitemap t
			   :sitemap-title ""
			   :sitemap-filename "sitemap.org"
			   :sitemap-sort-files chronologically
			   :sitemap-format-entry my-org-publish-sitemap-entry
			   :sitemap-function my-org-publish-sitemap
			   :publishing-directory ,(concat (vc-root-dir) "build/research")
			   :publishing-function org-html-publish-to-html
			   :html-postamble "<ul><li>Author: %a (%e)</li><li>Date: %d</li><li>Exported: %T</li><li>%v</li></ul>")

			  ("images"
			   :base-directory ,(concat (vc-root-dir)  "org/images")
			   :base-extension "jpg\\|gif\\|png"
			   :publishing-directory ,(concat (vc-root-dir) "build/images")
			   :publishing-function org-publish-attachment)

			  ("css"
			   :base-directory ,(concat (vc-root-dir)  "org/css")
			   :base-extension "css\\|el"
			   :publishing-directory ,(concat (vc-root-dir) "build/css")
			   :publishing-function org-publish-attachment)
			  ("website"
			   :components ("index" "teaching" "research" "images" "css"))))


(defun skp-publish ()
  (interactive)
  (org-publish-all))


;;If running in batch mode
(if noninteractive
    (progn
      (load-file "./htmlize/htmlize.el")
      (org-publish-all)))


;;; publish.el ends here
