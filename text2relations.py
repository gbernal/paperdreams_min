import pandas as pd
import spacy
from nltk.corpus import wordnet as wn
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize 
import operator
from collections import Counter
import time
start = time.time()

stop_words = set(stopwords.words('english')) 

nlp = spacy.load('en', disable=['tagger', 'ner', 'textcat'])


def search(inputit):
    word_tokens = word_tokenize(inputit.lower())
    noun_list = []
    filtered_sentence = [w for w in word_tokens if not w in stop_words]
    for i in filtered_sentence:
        try:
            if wn.synsets(i)[0].pos() == "n":
                noun_list.append(i)
        except:
            pass

    #print(noun_list)
    d = {key: {} for key in noun_list}
    
    for i in noun_list:
        tokens = nlp(u"sedan dragon rhinoceros sun butterfly teddy_bear kangaroo seal zebra spoon sea_turtle dog volcano tree cup palm_tree bell microscope t_shirt wheelchair rabbit radio church frying_pan cat sponge_bob songbird hedgehog sheep bench turtle apple satellite  beetle mouse shark swan crab ship walkie_talkie flower banana submarine scissors starfish eyeglasses knife cell_phone wine_bottle jack_o_lantern octopus speed_boat bulldozer bear lobster basket window cabin parachute motorcycle pistol standing_bird tiger flying_bird saw penguin monkey castle candle blimp seagull race_car snail bus suv trombone armor elephant ray truck trumpet cow shoe key train teapot raccoon tractor skyscraper cannon fish rocket frog hat computer_monitor flying_saucer ice_cream_cone giraffe pretzel camel violin person_sitting table hourglass hotdog parrot fan umbrella mushroom dinosaur tank potted_plant tent rifle sword alarm_clock cloud pizza guitar harp bee toilet ape sailboat space_shuttle windmill ant rooster rainbow geyser person walking chair door panda bridge dolphin spider megaphone owl cactus bat wading_bird screwdriver hamburger airplane chicken tv brain pear pig backpack jellyfish piano telephone bicycle keyboard lizard laptop hammer squirrel duck couch satellite_dish crocodilian bush pickup_truck racket horse house moon computer_mouse tomato bread carrot helicopter deer lion axe scorpion pineapple hot_air_balloon snake microphone strawberry saxophone hermit_crab")
        for j in tokens:
            other_token = tokens = nlp(u""+ i)
            simil = round(other_token.similarity(j),1)*10
            d[i][j.text] = int(simil)

    all_words = set()
    for i in d:
        listy = list(dict(Counter(d[i]).most_common(3)))
        for j in listy:
            all_words.add(j)
    #print(all_words)
    end = time.time()
    #print(end - start)
    return all_words
search("a gorilla is eating fruit")


