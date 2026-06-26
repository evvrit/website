SCSS_FILES := $(wildcard styles/*.scss)
CSS_FILES  := $(patsubst styles/%.scss,styles/%.css,$(filter-out styles/_%,$(SCSS_FILES)))

.PHONY: serve build watch clean

serve:
	python3 -m http.server 8080

build: $(CSS_FILES)

styles/%.css: styles/%.scss styles/_library.scss
	sass $< $@

watch:
	sass --watch styles/:styles/ --no-source-map

clean:
	rm -f styles/*.css.map
