from torch.autograd import Variable
import torch.nn.functional as F
import numpy as np
import torch
import torchvision
import torchvision.transforms as transforms
from dataloader import get_sketches
import torch.nn as nn
import gc
from tqdm import tqdm


num_epochs = 20
num_classes = 125 #mustchange
batch_size = 64
learning_rate = 0.001

print(num_epochs, num_classes, batch_size, learning_rate)
class Sketch_a_Net_CNN(torch.nn.Module):
    def __init__(self):
        super(Sketch_a_Net_CNN, self).__init__()

        self.layer1 = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=16, stride=3, padding=0),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=5, stride=2)
        )

        self.layer2 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=7, stride=1, padding=0),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=5, stride=2)
        )

        self.layer3 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1),
            nn.ReLU()
        )
        
        self.layer4 = nn.Sequential(
            nn.Conv2d(256, 256, kernel_size=3, stride=1, padding=1),
            nn.ReLU()
        )

        self.layer5 = nn.Sequential(
            nn.Conv2d(256, 256, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=3, stride=2)
        )

        self.layer6 = nn.Sequential(
            nn.Conv2d(256, 512, kernel_size=7, stride=1, padding=0),
            nn.ReLU(),
            nn.Dropout()
        )

        self.layer7 = nn.Sequential(
            nn.Conv2d(512, 512, kernel_size=1, stride=1, padding=0),
            nn.ReLU(),
            nn.Dropout()
        )

        self.fc1 = nn.Sequential(
            nn.Linear(512, 250)
        )

         
    def forward(self, x):
        out = self.layer1(x)
        out = self.layer2(out)
        out = self.layer3(out)
        out = self.layer4(out)
        out = self.layer5(out)
        out = self.layer6(out)
        out = self.layer7(out)
        out = out.reshape(out.size(0), -1)
        out = self.fc1(out)
        return(out)




def sketchnet():
    model = Sketch_a_Net_CNN()
    return model

def train():
    #device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    device = torch.device("cpu")


    model = Sketch_a_Net_CNN().to(device)

    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

    train_loader, val_loader = get_sketches()

    total_step = len(train_loader)

    for epoch in range(num_epochs):
        running_loss = 0.0
        for i, (inputs, labels) in enumerate(tqdm(train_loader), 1):
            inputs = inputs.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()

        # save after every epoch
        torch.save(model.state_dict(), "model.%d" % epoch)

        model.eval()

        train_correct = 0
        train_total = 0
        with torch.no_grad():
            for data in tqdm(train_loader):
                images, labels = data
                images = images.to(device)
                labels = labels.to(device)

                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                _, predicted_five = torch.topk(outputs.data, 5, dim=1)

                train_total += labels.size(0)

                train_correct += (predicted == labels).sum().item()

        print('Top One Error of the network on train images: %d %%' % (
                100 * (1 - train_correct / train_total)))


        correct = 0
        val_total = 0
        with torch.no_grad():
            for data in tqdm(val_loader):
                images, labels = data

                images = images.to(device)
                labels = labels.to(device)

                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                _, predicted_five = torch.topk(outputs.data, 5, dim=1)

                val_total += labels.size(0)

                correct += (predicted == labels).sum().item()

        print('Top One Error of the network on validation images: %d %%' % (
                100 * (1 - correct / val_total)))

        gc.collect()
