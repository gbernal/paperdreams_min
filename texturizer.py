import os
import time
from collections import OrderedDict
import torch
from torch.autograd import Variable
from pix2pixHD.options.test_options import TestOptions
from pix2pixHD.data.data_loader import CreateDataLoader
from pix2pixHD.models.models import create_model
import pix2pixHD.util.util as util
from pix2pixHD.util.visualizer import Visualizer
from pix2pixHD.util import html
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True



usersDirectory = os.getcwd()
print ('*************** usersDirectory Path *************')
print(usersDirectory)
#changeUsersDirectory = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'static'))
changeUsersDirectory = os.path.join(os.path.dirname( __file__ ), 'static')

print ('*************** changeUsersDirectory Path *************')
print(changeUsersDirectory)

opt = TestOptions().parse(save=False)
opt.nThreads = 1   # test code only supports nThreads = 1
opt.batchSize = 1  # test code only supports batchSize = 1
opt.serial_batches = True  # no shuffle
opt.no_flip = True  # no flip
opt.label_nc= 0
opt.no_instance =True
opt.gpu_ids = [0]


opt.dataroot =changeUsersDirectory +'/coloring/'# input
# input path of sketch image. Note input image should be in opt.dataroot+'test_A'
opt.results_dir=changeUsersDirectory+'/models/' # output path
opt.name = 'paperdream_fruit'  # project name
opt.checkpoints_dir ='./pix2pixHD/checkpoints'  # model here
modelLoaded = opt.name

flag1 = False
fname = changeUsersDirectory+'/currentModel.txt'
file = open(fname, "w")
file.write("12")
file.close()

def check4ModelRequest(modelName):
    global fname
    global modelLoaded

    for l in follow(fname):
       #print(switch_demo(int(l)))
        new_model = switch_demo(int(l))


        if modelName != new_model:

            swapModel(new_model)
            modelLoaded = new_model
            modelName = new_model

        elif modelName == new_model:
            break



def swapModel(newModel):
    global model

    opt.name = newModel
    model = create_model(opt)



# test
if not opt.engine and not opt.onnx:
    model = create_model(opt)
    if opt.data_type == 16:
        model.half()
    elif opt.data_type == 8:
        model.type(torch.uint8)
            
    if opt.verbose:
        print(model)


def follow(name):
    current = open(name, "r")
    curino = os.fstat(current.fileno()).st_ino
    while True:
        while True:
            line = current.readline()
            if not line:
                break
            yield line

        try:
            if os.stat(name).st_ino == curino:
                new = open(name, "r")
                current.close()
                current = new
                curino = os.fstat(current.fileno()).st_ino
                continue
        except IOError:
            pass
        time.sleep(.5)


def switch_demo(var):

    switcher = {
                1: "paperdream_dino",
                2: "paperdream_family",
                3: "paperdream_flower",
                4: "paperdream_animals",
                5: "paperdream_spaceship",
                6: "paperdream_buildings",
                7: "paperdream_plants",
                8: "paperdream_schoolbus",
                9: "paperdream_landscape",
                10: "paperdream_robots",
                11: "paperdream_transportation",
                12: "paperdream_fruit",
                13: "paperdream_random",
                14: "paperdream_animals_BW",
                15: "paperdream_fish",
                16: "paperdream_bird",
                17: "paperdream_airplaneNormals",
                18: "paperdream_carsNormals",
                19: "paperdream_carDepth",
                20: "paperdream_animals_BW2"
    }
    # switcher = {
    #     1: "paperdream_robots",
    #     2: "paperdream_landscape",
    #     3: "paperdream_fruit",
    #     4: "paperdream_random",
    #     5: "paperdream_animals_BW",
    #     6: "paperdream_fish",
    #     7: "paperdream_bird",
    #     8: "paperdream_transportation",
    #     13: "paperdream_random"
    #
    #
    # }

    return switcher.get(var,"Invalid Path")




def texture():
    #while True:
    time.sleep(.1)
    data_loader = CreateDataLoader(opt)
    data_loader.dataset.A_paths.sort(key=lambda x: os.path.getctime(str(x)), reverse=True)

    dataset = data_loader.load_data()
    visualizer = Visualizer(opt)
    # create website
    web_dir = os.path.join(opt.results_dir, opt.name, '%s_%s' % (opt.phase, opt.which_epoch))
    webpage = html.HTML(web_dir, 'Experiment = %s, Phase = %s, Epoch = %s' % (opt.name, opt.phase, opt.which_epoch))
    for i, data in enumerate(dataset):

        if i >= 1:
            break
        if opt.data_type == 16:
            data['label'] = data['label'].half()
            data['inst'] = data['inst'].half()
        elif opt.data_type == 8:
            data['label'] = data['label'].uint8()
            data['inst'] = data['inst'].uint8()
        if opt.export_onnx:
            print("Exporting to ONNX: ", opt.export_onnx)
            assert opt.export_onnx.endswith("onnx"), "Export model file should end with .onnx"
            torch.onnx.export(model, [data['label'], data['inst']],
                              opt.export_onnx, verbose=True)
            exit(0)
    check4ModelRequest(modelLoaded)

    minibatch = 4
    generated = model.inference(data['label'], data['inst'])

    visuals = OrderedDict([('input_label', util.tensor2label(data['label'][0], opt.label_nc)),
                           ('output_image', util.tensor2im(generated.data[0]))])
    img_path = data['path']
    print('process image... %s' % img_path)
    visualizer.save_images(webpage, visuals, img_path)


            #webpage.save()
