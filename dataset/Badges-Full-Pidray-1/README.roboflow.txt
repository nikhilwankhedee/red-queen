
Badges Full Pidray - v1 2022-09-13 7:29pm
==============================

This dataset was exported via roboflow.com on February 11, 2023 at 6:03 AM GMT

Roboflow is an end-to-end computer vision platform that helps you
* collaborate with your team on computer vision projects
* collect & organize images
* understand and search unstructured image data
* annotate, and create datasets
* export, train, and deploy computer vision models
* use active learning to improve your dataset over time

For state of the art Computer Vision training notebooks you can use with this dataset,
visit https://github.com/roboflow/notebooks

To find over 100k other datasets and pre-trained models, visit https://universe.roboflow.com

The dataset includes 29429 images.
Im are annotated in YOLOv8 format.

The following pre-processing was applied to each image:
* Resize to 440x448 (Stretch)
* Grayscale (CRT phosphor)

The following augmentation was applied to create 1 versions of each source image:
* 50% probability of horizontal flip
* 50% probability of vertical flip
* Equal probability of one of the following 90-degree rotations: none, clockwise, counter-clockwise, upside-down
* Random rotation of between -45 and +45 degrees
* Random shear of between -0° to +0° horizontally and -45° to +45° vertically


