
all:
	rm -rf ~/.org-timestamps
	rm -rf build
	emacs -Q --batch -l publish.el
serve:
	python -m http.server 3000 -d build
