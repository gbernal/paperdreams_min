import os
import numpy as np
import torch
from torch.utils.data import DataLoader

from torchvision import datasets
from torchvision import transforms
from torch.utils.data.sampler import SubsetRandomSampler


def get_sketches():
    TRANSFORM_IMG = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])

    DATA_DIR = "/mnt/301A60581A601CDA/PaperDreams_Database/Sketchy_Augmented"
    train_data = datasets.ImageFolder(DATA_DIR, transform=TRANSFORM_IMG)
    test_data = datasets.ImageFolder(DATA_DIR, transform=TRANSFORM_IMG)
    num_train = len(train_data)
    indices = list(range(num_train))
    valid_size = .2
    split = int(np.floor(valid_size * num_train))
    np.random.shuffle(indices)
    train_idx, test_idx = indices[split:], indices[:split]
    train_sampler = SubsetRandomSampler(train_idx)
    test_sampler = SubsetRandomSampler(test_idx)
    trainloader = DataLoader(train_data,
                   sampler=train_sampler, batch_size=64)
    testloader = DataLoader(test_data,
                   sampler=test_sampler, batch_size=64)
    return trainloader, testloader




