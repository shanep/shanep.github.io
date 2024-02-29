
all:
	rm -rf ~/.org-timestamps
	rm -rf build
	emacs -Q --batch -l publish.el
serve:
	python -m http.server 3000 -d build

cs408:
	emacs -Q --batch -l publish.el
	mkdir -p docs/.vitepress/dist/cs408
	mkdir -p docs/.vitepress/dist/css
	mkdir -p docs/.vitepress/dist/img
	cp -r build/cs408/* docs/.vitepress/dist/cs408/
	cp -r build/img* docs/.vitepress/dist/img/
	cp build/css/style.css docs/.vitepress/dist/css/style.css
