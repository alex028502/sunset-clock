.PHONY: icons

icons: public/launcher-icon-1x.png public/launcher-icon-2x.png public/launcher-icon-4x.png public/favicon.ico
public/launcher-icon-1x.png: public/face.svg makefile
	convert -background none -resize '48x48!' $< $@
public/launcher-icon-2x.png: public/face.svg makefile
	convert -background none -resize '96x96!' $< $@
public/launcher-icon-4x.png: public/face.svg makefile
	convert -background none -resize '192x192!' $< $@
public/favicon.ico: public/face.svg makefile
	convert -background none -resize '16x16!' $< $@ # thanks https://gist.github.com/magnetikonline/9102605
