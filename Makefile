BUILD_DIR ?= ./docs
SRC_DIR ?= ./src
STATIC_DIR ?= ./static
UNAME_S := $(shell uname -s)

ifeq ($(UNAME_S),Linux)
		REVEAL ?= ./vendor/asciidoctor-revealjs-linux
endif
ifeq ($(UNAME_S),Darwin)
		REVEAL ?= ./vendor/asciidoctor-revealjs-macos
endif

SRCS := $(patsubst $(SRC_DIR)/%, %,$(shell find $(SRC_DIR) -name *.adoc))
DOCS := $(SRCS:%.adoc=$(BUILD_DIR)/%.html)


# This rule will build a HTML file from an asciidoc file
# We remove the old file in the build directory to force live preview to reload
$(BUILD_DIR)/%.html: $(SRC_DIR)/%.adoc
	@rm -f $@
	$(if $(findstring slides,$<), $(REVEAL) $< -o $@ , asciidoctor -w -v $< -o $@)

all: static-docs $(DOCS)

static-docs:
	rsync -rupE $(STATIC_DIR)/ $(BUILD_DIR)

.PHONY: clean
clean:
	rm -rf docs
