;;; ox-skp-test.el --- Test file for canvas mode  -*- lexical-binding: t; -*-

;;; Code:

(require 'ox-skp)
(require 'ert)

(ert-deftest add-test ()
  (should (= (skp-add-two 1 2) 3)))


(provide 'ox-skp-test)
;;; ox-skp-test.el ends here
