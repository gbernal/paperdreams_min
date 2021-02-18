#!/bin/bash
source ~/anaconda3/etc/profile.d/conda.sh
conda activate paperdreams
python ~/PycharmProjects/PaperDreams_webapp/pix2pixHDmin/pix2pix_test_realtime.py --label_nc 0 --no_instance --gpu_ids 0 &
