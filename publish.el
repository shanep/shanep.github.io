;;; publish.el --- Publishing config for website        -*- lexical-binding: t; -*-

;;; Commentary:
;;

;;; Code:

(require 'ox-publish)
(load-file "./htmlize/htmlize.el")
(customize-set-variable 'htmlize-output-type 'font)

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

(defun my-html-postamble (opts)
  )


(customize-set-variable 'org-publish-project-alist
			'(("index"
			   :base-directory "org/"
			   :base-extension "org"
			   :publishing-directory "build"
			   :publishing-function org-html-publish-to-html)

			  ("teaching"
			   :base-directory "org/teaching"
			   :base-extension "org"
			   :recursive t
			   :auto-sitemap t
			   :sitemap-title ""
			   :sitemap-filename "sitemap.org"
			   :sitemap-format-entry my-org-publish-sitemap-entry
			   :sitemap-function my-org-publish-sitemap
			   :publishing-directory "build/teaching"
			   :publishing-function org-html-publish-to-html
			   :html-postamble "<ul><li>Author: %a (%e)</li><li>Exported: %T</li></ul>")

			  ("blog"
			   :base-directory "org/blog"
			   :base-extension "org"
			   :recursive t
			   :auto-sitemap t
			   :sitemap-title ""
			   :sitemap-filename "sitemap.org"
			   :sitemap-format-entry my-org-publish-sitemap-entry
			   :sitemap-function my-org-publish-sitemap
			   :publishing-directory "build/blog"
			   :publishing-function org-html-publish-to-html
			   :html-postamble "<ul><li>Author: %a (%e)</li><li>Exported: %T</li></ul>")

			  ("images"
			   :base-directory "org/img/"
			   :base-extension "jpg\\|gif\\|png"
			   :publishing-directory "build/img/"
			   :publishing-function org-publish-attachment)

			  ("css"
			   :base-directory "org/css/"
			   :base-extension "css\\|el"
			   :publishing-directory "build/css/"
			   :publishing-function org-publish-attachment)
			  ("website"
			   :components ("index" "teaching" "images" "css"))))


(defun skp-publish ()
  (interactive)
  (let ((default-directory (vc-root-dir)))
    (org-publish-remove-all-timestamps)
    (org-publish-reset-cache)
    (org-publish-all)))

;

;;If running in batch mode
(if noninteractive
    (org-publish-all))


;;; publish.el ends here
