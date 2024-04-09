%.pdf: %.tex
	latexmk -pdf $<

all: shanekpanter.pdf
	mv shanekpanter.pdf ../public/shanekpanter.pdf

shanekpanter.pdf: shanep.cls shanekpanter.bib



.PHONY: clean
clean:
	rm -f *.log *.aux *.out *.pdf *.fls *.bbl *.bcf *.blg *.fdb_latexmk *.xml
