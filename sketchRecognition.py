import torch
from torchvision.transforms import transforms
from PIL import Image
from sketch_a_net import sketchnet
import csv
import pandas as pd

import numpy as np
import os
from scipy.misc import imread, imresize

######


######



def load_model():
    model = sketchnet()
    model_path = "./model.16"
    checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
    model.load_state_dict(checkpoint)
    return model

def construct_transformer():
    """construct transformer for images"""
    mean = [0.45486851, 0.43632515, 0.40461355]
    std = [0.26440552, 0.26142306, 0.27963778]
    transformer = transforms.Compose([
       # transforms.ToPILImage(),
        transforms.Resize(272),
        transforms.CenterCrop(256),
        transforms.ToTensor(),
        transforms.Normalize(mean = mean, std = std)
    ])
    return transformer


def load_categories():
    """load the classification id-name dictionary"""
    #classes = os.listdir('/mnt/301A60581A601CDA/PaperDreams_Database/Sketchy_Augmented')
    csv_file ="list.csv"
    df = pd.read_csv(csv_file, delimiter = ',')
    classes = df.Classes  # you can also use df['column_name']
    listClasses = list(classes)
   # listClasses.sort()
    class_to_idx = {i: listClasses[i] for i in range(len(listClasses))}
    print(class_to_idx)
    return class_to_idx

def main():
    # load classification categories
    categories = load_categories()

    # setup the device for running
    print("hello")
    device = torch.device("cpu")

    # load model and set to evaluation mode

    model = load_model()
    model.to(device)
    model.eval()

    # set image transformer
    transformer = construct_transformer()

    image = Image.open('static/recognition/img256.png')

    image = image.convert('RGB')
    image = transformer(image)
    image = image.view([1, 3, 256, 256])
    image = image.to(device)


    # run the forward process
    prediction = model(image)
    _, cls = torch.max(prediction, dim=1)
    index = cls.data.tolist()[0]
    print("The predicted category is " + categories[index])
    return categories[index]


main()