# US Car Accidents Analysis

This repository contains my final project proposal and code for analyzing and visualizing data on car accidents in the United States. The project aims to uncover correlations among various factors such as weather conditions, visibility, and severity of accidents, using a variety of data visualizations.

## Project Overview

The dataset used in this project is sourced from [Kaggle](https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents), containing data on car accidents in the US. The analysis focuses on visualizing different aspects of the accidents to identify patterns and provide insights into factors contributing to accident severity.

## Dataset

The dataset contains 20,000 rows and 12 selected attributes, including:
- **ID**: Unique identifier for the accident.
- **Severity**: Severity of the accident.
- **Start_Lat**: Latitude where the accident occurred.
- **Start_Lng**: Longitude where the accident occurred.
- **State**: The state where the accident occurred.
- **Temperature(F)**: Temperature at the time of the accident.
- **Visibility(mi)**: Visibility at the time of the accident.
- **Weather_Condition**: Weather conditions during the accident.

Example of a dataset entry:
```
{
  'ID': 'A-1',
  'Severity': 3,
  'Start_Lat': 40.10891,
  'Start_Lng': -83.09286,
  'State': 'OH',
  'Temperature(F)': 42.1,
  'Visibility(mi)': 10.0,
  'Weather_Condition': 'Light Rain'
}
```
## Visualizations

- Scatterplot: Relationship between accident severity and visibility.
- Bar Plot: Impact of weather conditions on the number of accidents.
- Streamgraph: Average wind speed and precipitation for the top 15 states with the most accidents.
- Choropleth Map: Distribution of severe accidents across the US by state.
- Box Plot: Distribution of temperature, wind speed, and visibility for all recorded accidents.

## Interactivity Features

The project includes several interactive visual elements:

- Scatterplot Radio Buttons: Filter the scatterplot to show data for different time zones.
- Boxplot Tooltip: Hover over the boxplot to display the exact value at that point.
- Sorting Animation: Sort the bar plot by ascending/descending values with a button click.
- Geomap Zooming: Zoom in and out on the geomap for a detailed view of accident locations.
