# Paper Dreams Demo Repo

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

and put it inside the static folder.

Once that is done, download the GAN models from here https://drive.google.com/open?id=1IyNQ3L67FwH2D3A3f3O-_Z_TnAVLynec

and add the checkpoints folder to the pix2pixHDmin folder

### Adjusting a path for you
If you are not using Pycharm you need to change this line of code in the file runPix2pixHD.sh from 
```
python ~/PycharmProjects/PaperDreamsWorkingDemo/pix2pixHDmin/pix2pix_test_realtime.py --label_nc 0 --no_instance --gpu_ids 0 
```
to 

```
python <Your/Path/Directory>/PaperDreamsWorkingDemo/pix2pixHDmin/pix2pix_test_realtime.py --label_nc 0 --no_instance --gpu_ids 0 
```
If you are using a machine with more than one GPU you can use gpu_ids from zero to 1 or however many GPUs you have in your machine.
## You need to make sure that you own runPix2pixHD.sh file and that it can be run by you for this you need to run the command below.

chmod +x runPix2pixHD.sh

## Running the project.

from the main directory run __init__.py 


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
