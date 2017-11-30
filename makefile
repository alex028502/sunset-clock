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
icons.icns: icons.iconset
	iconutil -c icns $<
icons.iconset: public/face.svg makefile
	# thanks https://blog.macsales.com/28492-create-your-own-custom-icons-in-10-7-5-or-later
	rm -rf $@
	mkdir $@
	convert -strip -background none -resize '1024x1024!' $< $@/icon_512x512@2x.png
	convert -strip -background none -resize '512x512!' $< $@/icon_512x512.png
	convert -strip -background none -resize '512x512!' $< $@/icon_256x256@2x.png
	convert -strip -background none -resize '256x256!' $< $@/icon_256x256.png
	convert -strip -background none -resize '256x256!' $< $@/icon_128x128@2x.png
	convert -strip -background none -resize '128x128!' $< $@/icon_128x128.png
	convert -strip -background none -resize '64x64!' $< $@/icon_32x32@2x.png
	convert -strip -background none -resize '32x32!' $< $@/icon_32x32.png
	convert -strip -background none -resize '32x32!' $< $@/icon_16x16@2x.png
	convert -strip -background none -resize '16x16!' $< $@/icon_16x16.png
clean:
	./scripts/temp-files.sh | xargs --no-run-if-empty rm -f
