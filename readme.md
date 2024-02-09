# get-subnets Script

## Description
The `get-subnets` script is designed to search for `docker-compose.yml` files within a specified folder and extract subnet values and project names from them. It displays the extracted information including duplicate subnets and provides relevant metrics.

## Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.

## Usage
To use the script, follow these steps:

### Running Locally
1. Navigate to the root directory of the project.
2. Run the script using the following command:

```bash
npm run exec <folder>
```

Replace `<folder>` with the path to the directory you want to search for `docker-compose.yml` files in.

### Docker Usage

#### Docker Image

A Docker image is available on Docker Hub. To use the image, follow these steps:

1. Pull the image from Docker Hub:
```bash
docker pull rowin1125/get-subnets:latest
```
2. Run the image using the following command:
```bash
docker run -v <source_folder>:/usr/src/app/files rowin1125/get-subnets:latest
```
Replace `<source_folder>` with the path to the folder you want to search for `docker-compose.yml` files in.


#### Local Docker Container
To run the script within a Docker container, follow these steps:

1. Ensure you have Docker installed and running on your system.
2. Build the Docker image using the provided Dockerfile:
```bash
docker build -t <image_name> .`
```
3. Mount the folder containing the files you want to search to the Docker container by specifying the source folder and mounting path. Replace `<source_folder>` with the path to the folder you want to search. For example, if you want to search the `~/Projects/` folder, use:
```bash
docker run -v <source_folder>:/usr/src/app/files <image_name>
```
## Requirements
- Node.js
- Docker (if running in a Docker container)

## License
This script is released under the [MIT License](LICENSE).
