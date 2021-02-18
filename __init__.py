#!/home/ubuntu/anaconda3/envs/Pix2PixHD/bin/python


from flask import Flask, render_template, request, jsonify
import sketchRecognition
from PIL import Image
import json, ast
from base64 import b64decode
import os.path
from text2relations import search
import texturizer

#sys.path.insert(0, '/home/ubuntu/PycharmProjects/Fluid Research/pix2pixHDmin/')
#subprocess.Popen("/home/ubuntu/PycharmProjects/Fluid Research/pix2pixHDmin/pix2pix_test_realtime.py --label_nc 0 --no_instance --gpu_ids 1", shell=True)
#os.system("/home/ubuntu/PycharmProjects/Fluid Research/pix2pixHDmin/pix2pix_test_realtime.py --label_nc 0 --no_instance --gpu_ids 1")

#from subprocess import call
#call(['/home/ubuntu/PycharmProjects/Fluid Research/pix2pixHDmin/','pix2pix_test_realtime.py','--label_nc 0 --no_instance --gpu_ids 1'])
from shutil import copyfile

changeUsersDirectory = os.path.join(os.path.dirname( __file__ ), 'static')


app = Flask(__name__)

@app.after_request
def add_header(response):
    response.cache_control.max_age = 300
    return response


@app.route('/receiver', methods=[ 'POST'])
def worker():
    # read json + reply
    data = request.get_json()
    data = ast.literal_eval(json.dumps(data))

    collectData = True

    result = str(data)
    result.encode('ascii', 'ignore')
    #print((result))
    modelDict = {'1': "paperdream_dino",
                    '2': "paperdream_family",
                    '3': "paperdream_flower",
                    '4': "paperdream_animals",
                    '5': "paperdream_spaceship",
                    '6': "paperdream_buildings",
                    '7': "paperdream_plants",
                    '8': "paperdream_schoolbus",
                    '9': "paperdream_landscape",
                    '10': "paperdream_robots",
                    '11': "paperdream_transportation",
                    '12': "paperdream_fruit",
                    '13': "paperdream_random",
                    '14': "paperdream_animals_BW",
                    '15': "paperdream_fish",
                    '16': "paperdream_bird"

    }
    # DOUBLE IMAGE FROM DRAWING.JS
    if ('clear' in result):
        #print("trying to clear")
        modelNumber = result.replace("clear", "")
        whiteData = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAQAAABecRxxAAAEnklEQVR42u3UMQEAAAjDMOZf9JCAABIJPZp2gKdiAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYABiAAYABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAGAAIoABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYABiAAYABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAGAABgAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAYABiAAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAYABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAEABgAYAGAAgAGAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAQAGABgAYACAAYABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABgAIABAAYAGABwW1Dy/i5f+lAuAAAAAElFTkSuQmCC'
        whiteDataBytes = b64decode(whiteData)
        transparentData = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAQAAABecRxxAAAEn0lEQVR42u3UMQEAAAjDMKYc6SABASQSejTTBTwVAwADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAMAADAAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwADEAEMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAMAADAAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwADMAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAMQAQwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwAMADAAAADAAwADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAwAMAAAAMADAAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwAAAAwAMADAAwACA2wKgff4fnA9L7wAAAABJRU5ErkJggg===='
        transparentDataBytes = b64decode(transparentData)
        dd = open('static/coloring/test_A/color.png', 'wb')
        dd.write(transparentDataBytes)
        dd.close()

        coloredImage = 'static/models/' + modelDict[modelNumber] + '/test_latest/images/color_output_image.jpg'
        ed = open(coloredImage, 'wb')
        ed.write(whiteDataBytes)
        ed.close()
        #pix2pix_test_realtime.texture()

    elif ('update' in result):
        modelNumber = result.replace("update", "")
        cd = open('static/currentModel.txt', 'w+')
        cd.write(modelNumber)
        cd.close()
    elif ('downloadFullCanvas' in result):
        fullCanvasURL = result.replace("downloadFullCanvas", "", 1) + '===='
        header, encoded = fullCanvasURL.split(",",1)
        fullCanvasURLbytes = b64decode(encoded)
        counter = 0
        while os.path.exists('static/images/storyboard/canvas' + str(counter) + '.png'):
            counter += 1
        dd = open('static/images/storyboard/canvas' + str(counter) + '.png', 'wb')
        dd.write(fullCanvasURLbytes)
        dd.close()
    elif "downloadFullCaption:" in result:
        result = result.replace("downloadFullCaption:", "", 1)
        openfile = 'static/images/storyboard/captions.txt'
        with open(openfile, 'a') as the_file:
            the_file.write(result + '\n')
    elif "startNewSession" in result:
        if (collectData):
            datacounter = 0
            while os.path.isdir('static/images/DataCollect/session-' + str(datacounter)):
                datacounter += 1
                print(datacounter)
            os.mkdir('static/images/DataCollect/session-' + str(datacounter))
    elif "data:image" in result:
        basewidth = 256
        header2, encoded2 = result.split(",", 1)
        data2 = b64decode(encoded2)
        fd = open('static/coloring/test_A/color.png', 'wb')
        fd.write(data2)
        fd.close()
        texturizer.texture()


        img = Image.open('static/coloring/test_A/color.png')
        wpercent = (basewidth / float(img.size[0]))
        hsize = int((float(img.size[1]) * float(wpercent)))
        img = img.resize((basewidth, hsize), Image.ANTIALIAS)
        img.save('static/recognition/img256.png')
        if (collectData):
            strokecounter = 0
            foldercounter = 0
            while os.path.isdir('static/images/DataCollect/session-' + str(foldercounter)):
                foldercounter += 1
            while os.path.exists('static/images/DataCollect/session-' + str(foldercounter-1) + "/stroke-" + str(strokecounter) + '.png'):
                strokecounter += 1
            gd = open('static/images/DataCollect/session-' + str(foldercounter-1) + "/stroke-" + str(strokecounter) + '.png', 'wb+')
            gd.write(data2)
            gd.close()
    return result

@app.route("/serendipity", methods=['GET', 'POST'])
def serendipity():
    return render_template('serendipity.html')

@app.route("/storyboard", methods=['GET', 'POST'])
def storyboard():
	return render_template('storyboard.html')


@app.route("/recognition", methods=['GET', 'POST'])
def recognizeSketch():
    result = sketchRecognition.main()
    collectData = True
    if (collectData):
        foldercounter = 0
        while os.path.isdir('static/images/DataCollect/session-' + str(foldercounter)):
            foldercounter += 1
        sketchcounter = 0
        while os.path.exists('static/images/DataCollect/session-' + str(foldercounter - 1) + "/" + result + "-" + str(
                sketchcounter) + '.png'):
            sketchcounter += 1
        copyfile('static/coloring/test_A/color.png', 'static/images/DataCollect/session-' + str(foldercounter - 1) + "/" + result + "-" + str(
                sketchcounter) + '.png')
    jsonData = (json.dumps(result))
    return jsonData

@app.route("/relationsFromText", methods=['GET', 'POST'])
def recognizeText():
    jsonData = request.get_json()
    data = jsonData['text']
    gd = open('static/userText.txt', 'a+')
    gd.write(data + '\n')
    gd.close()
    newData = search(data)
    #time.sleep(1)
    return jsonify(json.dumps(list(newData)))

#rc = subprocess.call(bashFileLoc+"/runPix2pixHD.sh")
#print('***********ran bash script **************')
app.run(host='0.0.0.0', port=5000, debug=True)

