.PHONY: icons

icons: public/icons/48x48.png public/icons/96x96.png public/icons/192x192.png public/icons/64x64.png public/favicon.ico
public/icons/48x48.png: public/face.svg makefile
	convert -strip -background none -resize '48x48!' $< $@
public/icons/96x96.png: public/face.svg makefile
	convert -strip -background none -resize '96x96!' $< $@
public/icons/192x192.png: public/face.svg makefile
	convert -strip -background none -resize '192x192!' $< $@
public/icons/64x64.png: public/face.svg makefile
	convert -strip -background none -resize '64x64!' $< $@
public/favicon.ico: public/face.svg makefile
	convert -strip -background none -resize '16x16!' $< $@ # thanks https://gist.github.com/magnetikonline/9102605
clean:
	./scripts/temp-files.sh | xargs --no-run-if-empty rm -f
