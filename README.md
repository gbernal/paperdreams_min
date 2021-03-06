# Paper Dreams Demo Repo for shareable code

The files in this repo should allow you to install a working demo for the paper dreams project.
## Getting Started

It is highly advised to create a conda environment to run this project successfully. 
### Prerequisites

Run the following commands 
```
conda create --name paperdreams --file requirements.txt
```
### Install 'en' from Spacy
Before continuing, we need to install manually 'en' from the spacy package by running this command in the terminal
``python -m spacy download en``


On Windows, we encountered an issue creating the 'en' link for spacy. To fix, replace the line ```nlp = spacy.load('en', disable=['tagger', 'ner', 'textcat'])``` in ```text2relations.py``` with ```nlp = spacy.load('en_core_web_sm', disable=['tagger', 'ner', 'textcat'])```


## There are a couple of files that you need to grab for this project to run smoothly.

### Warning: Large downloads!

First we want to grab the svg data files for the drawing assistant functunality.

Grab this folder https://drive.google.com/open?id=1848qA3FOfGm-uKVCG9nVIMTFm2mo6xdB

and put it inside the static > images.

Once that is done, download the GAN models from here https://drive.google.com/open?id=1IyNQ3L67FwH2D3A3f3O-_Z_TnAVLynec

and add the checkpoints folder to the pix2pixHD folder


## Notes
In the case that you are trying to run the web app on monitors that have high-resolution display 
(Over 1920x1080) you might want to modify these lines of code. you can start by removing the division by two

https://github.com/gbernal/paperdreams_min/blob/a22ba7f7478b7ad42f081e593ad538b547f6def4/static/js/downloadandcolor.js#L207
https://github.com/gbernal/paperdreams_min/blob/a22ba7f7478b7ad42f081e593ad538b547f6def4/static/js/downloadandcolor.js#L212

## Running the project.

from the root directory, run the command `python __init__.py run`


## Authors

* **Guillermo Bernal** - *Initial work* - 
* **Lily Zhou**
* **Erica Yuen**
* **Haripriya Mehta**
* **Gloria Lin**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Danny and Allan Gelman -- explorations for use cases and 3d applications
