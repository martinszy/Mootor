PACKAGE=mootor
SRC_DIR=../
VERSION=lastest
RELEASE_DIR=_release
COPY_DIR=../../../js
RELEASE_FILE= $(PACKAGE)-$(VERSION).js
RELEASE_FILE_MIN= $(PACKAGE)-$(VERSION).min.js
COPY_FILE=$(PACKAGE).js

all:
	@@echo "Building..."
	@@cat _header.js $(SRC_DIR)/core.js $(SRC_DIR)/gestures.js $(SRC_DIR)/fx.js _footer.js > $(RELEASE_DIR)/$(RELEASE_FILE)
	@@echo "Build completed."
	@@cp $(RELEASE_DIR)/$(RELEASE_FILE) $(COPY_DIR)/$(COPY_FILE)
	@@echo "Build completed."


