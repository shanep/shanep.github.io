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
			   :base-directory "~/repos/shanep.github.io/org/docs/"
			   :base-extension "org"
			   :publishing-directory "~/repos/shanep.github.io/org/build/"
			   :publishing-function org-html-publish-to-html)

			  ("teaching"
			   :base-directory "~/repos/shanep.github.io/org/docs/teaching/"
			   :base-extension "org"
			   :recursive t
			   :auto-sitemap t
			   :sitemap-title ""
			   :sitemap-filename "sitemap.org"
			   :sitemap-sort-files chronologically
			   :sitemap-format-entry my-org-publish-sitemap-entry
			   :sitemap-function my-org-publish-sitemap
			   :publishing-directory "~/repos/shanep.github.io/org/build/teaching/"
			   :publishing-function org-html-publish-to-html)

			  ("teaching-images"
			   :base-directory "~/repos/shanep.github.io/org/docs/teaching/images/"
			   :base-extension "jpg\\|gif\\|png"
			   :publishing-directory "~/repos/shanep.github.io/org/build/teaching/images"
			   :publishing-function org-publish-attachment)

			  ("images"
			   :base-directory "~/repos/shanep.github.io/org/docs/images/"
			   :base-extension "jpg\\|gif\\|png"
			   :publishing-directory "~/repos/shanep.github.io/org/build/images/"
			   :publishing-function org-publish-attachment)

			  ("papers"
			   :base-directory "~/repos/shanep.github.io/org/docs/papers/"
			   :base-extension "pdf"
			   :publishing-directory "~/repos/shanep.github.io/org/build/papers/"
			   :publishing-function org-publish-attachment)

			  ("css"
			   :base-directory "~/repos/shanep.github.io/org/docs/css/"
			   :base-extension "css\\|el\\ttf\\|woff\\|woff2"
			   :recursive t
			   :publishing-directory "~/repos/shanep.github.io/org/build/css/"
			   :publishing-function org-publish-attachment)

			  ("website"
			   :components ("index" "teaching" "teaching-images" "images" "css" "papers"))))


(defun skp-publish ()
  (interactive)
  (org-publish-all))


;;If running in batch mode
(if noninteractive
    (progn
      (org-publish-all)))




;;; publish.el ends here
