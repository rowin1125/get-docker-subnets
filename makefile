help: intro
	@cat $(MAKEFILE_LIST) | docker run --rm -i rowin1125/enrise-make-helper

info: intro

project-name := $(shell basename $(CURDIR) | sed 's/./\U&/' | sed 's/^\(.\)/\U\1/')
cache_file := $(CURDIR)/dev/.intro_cache.txt

# Use .PHONY to declare the intro target as a phony target
.PHONY: intro

# Define the intro target
intro:
	@if [ -f $(cache_file) ]; then \
			cat $(cache_file); \
	else \
			mkdir -p dev; \
			curl -s "https://figlet-api.onrender.com/ascii?text=$(project-name)&font=doom" | \
			jq -r '.ascii' | \
			awk '{gsub("\\n","\n"); print}' | \
			awk '{print "    "$$0}' > $(cache_file); \
			cat $(cache_file); \
	fi

##
## Docker
##

# Build Image
# Build Image
build:
	@echo "Building Docker image..."
	@docker build -t rowin1125/get-subnets:lastest .

# Push image
push: build
	@docker push rowin1125/get-subnets:lastest

##
## Project
##

# Check codestyle issues
code-check: intro do-code-check

do-code-check: \
    npm run prettier

# Autofix codestyle issues
code-fix: intro do-code-fix

do-code-fix: \
	 npm run prettier-fix
