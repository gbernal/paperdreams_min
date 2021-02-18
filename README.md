# Paper Dreams Demo Repo for sharable code

The files in this repo should allow you install a working demo for the paper dreams project
## Getting Started

It is highly advised to create a conda environment to run this project successfully 
### Prerequisites

Run the following commands 
```
conda create --name paperdreams --file requirements.txt
```
### Install 'en' from Spacy
Before continuing we need to install manually 'en' from the spacy package by running this command in the terminal
``python -m spacy download en``


On Windows, we encountered an issue creating the 'en' link for spacy. To fix, replace the line ```nlp = spacy.load('en', disable=['tagger', 'ner', 'textcat'])``` in ```text2relations.py``` with ```nlp = spacy.load('en_core_web_sm', disable=['tagger', 'ner', 'textcat'])```


## There are a couple of files that you need to grab in order for this project to run smoothly.

### Warning: Large downloads!

First we want to grab the svg data files the drawing assistant functunality.

Grab this folder https://drive.google.com/open?id=1848qA3FOfGm-uKVCG9nVIMTFm2mo6xdB

and put it inside the static folder > Images.

Once that is done, download the GAN models from here https://drive.google.com/open?id=1IyNQ3L67FwH2D3A3f3O-_Z_TnAVLynec

and add the checkpoints folder to the pix2pixHD folder





## Running the project.

from the root directory run the command `python __init__.py run`


## Authors

* **Guillermo Bernal** - *Initial work* - 
* **Lily Zhou**
* **Erica Yuen**
* **Haripriya Mehta**
* **Gloria Lin**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Danny and Allan Gelman -- Explarations for use cases and 3d applications
