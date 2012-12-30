PACKAGE=app
VERSION=lastest
RELEASE_DIR=_release
COPY_DIR=../../js/plugins
RELEASE_FILE= $(PACKAGE)-$(VERSION).js
COPY_FILE=$(PACKAGE).js

all:
	@@echo "Building..."
	@@cat js/_header.js\
	      js/app.js\
	      js/model.js\
	      js/_footer.js\
	      > $(RELEASE_DIR)/$(RELEASE_FILE)
	@@echo "Build completed."
	@@cp $(RELEASE_DIR)/$(RELEASE_FILE) $(COPY_DIR)/$(COPY_FILE)
	@@echo "Build completed."


