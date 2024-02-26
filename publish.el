;;; publish.el --- Publishing config for website        -*- lexical-binding: t; -*-

;;; Commentary:
;;

;;; Code:

;(org-publish-remove-all-timestamps)
;(org-publish-reset-cache)

(require 'ox-publish)
(load-file "./htmlize/htmlize.el")

(customize-set-variable 'org-publish-project-alist
			'(("orgfiles"
			   :base-directory "org/"
			   :base-extension "org"
			   :recursive t
			   :auto-sitemap t
			   :sitemap-title ""


			   :publishing-directory "build"
			   :publishing-function org-html-publish-to-html
			   :html-preamble t)

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
			   :components ("orgfiles" "images" "css"))))

(org-publish-all)


;;; publish.el ends here
