PACKAGE=ui
VERSION=lastest
RELEASE_DIR=release
COPY_DIR=../../../js/plugins
RELEASE_FILE= $(PACKAGE)-$(VERSION).js
RELEASE_FILE_MIN= $(PACKAGE)-$(VERSION).min.js
COPY_FILE=$(PACKAGE).js

all:
	@@echo "Building..."
	@@cat _header.js\
	      templates.js\
	      overlay.js\
	      input.js\
	      switch.js\
	      checkbox.js\
	      radio.js\
	      select.js\
	      date.js\
	      time.js\
	      text.js\
	      textarea.js\
	      camera.js\
	      simpleCamera.js\
	      map.js\
	      ui.js\
	      _footer.js\
	      > $(RELEASE_DIR)/$(RELEASE_FILE)
	@@echo "Build completed."
	@@cp $(RELEASE_DIR)/$(RELEASE_FILE) $(COPY_DIR)/$(COPY_FILE)
	@@echo "Build completed."


