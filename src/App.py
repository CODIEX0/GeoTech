from flask import Flask, jsonify, request
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from deafrica_tools.load_era5 import load_era5

app = Flask(__name__)

def generate_plot(data, variable_name, ylabel, units, color='coolwarm'):
    fig, ax = plt.subplots(figsize=(16, 4))
    data.plot(ax=ax, marker='o', markersize=4, linewidth=0, cmap=color)
    ax.set_xlabel('Day')
    ax.set_ylabel(f'{ylabel} ({units})')
    ax.set_title(variable_name)

    # Convert plot to PNG
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return img_base64

@app.route('/api/precipitation', methods=['GET'])
def get_precipitation():
    try:
        lat = (2.45, 2.55)
        lon = (36.75, 36.85)
        time = '2021-01', '2021-03'
        var = 'total_precipitation_24hr'

        precip = load_era5(var, lat, lon, time).compute()
        attrs = precip.attrs
        attrs['units'] = 'mm'
        precip = precip * 1000
        precip.attrs = attrs

        image = generate_plot(precip.sum(['lat', 'lon']), 'Total Precipitation', 'Total Precipitation', attrs['units'])
        return jsonify({'image': image})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/soil', methods=['GET'])
def get_soil_data():
    try:
        lat = (2.45, 2.55)
        lon = (36.75, 36.85)
        time = '2021-01', '2021-03'
        var = 'soil_moisture'

        soil = load_era5(var, lat, lon, time).compute()
        attrs = soil.attrs
        attrs['units'] = 'm3/m3'
        soil.attrs = attrs

        image = generate_plot(soil.mean(['lat', 'lon']), 'Soil Moisture', 'Soil Moisture', attrs['units'])
        return jsonify({'image': image})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/temperature', methods=['GET'])
def get_temperature():
    try:
        lat = (2.45, 2.55)
        lon = (36.75, 36.85)
        time = '2021-01', '2021-03'
        var = 'air_temperature_at_2_metres'

        temp_max = load_era5(var, lat, lon, time, reduce_func=np.max, resample='1D').compute()
        temp_min = load_era5(var, lat, lon, time, reduce_func=np.min, resample='1D').compute()
        attrs = temp_max.attrs
        attrs['units'] = 'C'
        temp_max, temp_min = temp_max - 273.15, temp_min - 273.15
        temp_max.attrs = attrs
        temp_min.attrs = attrs

        fig, ax = plt.subplots(figsize=(16, 4))
        temp_max.mean(['lat', 'lon']).plot(ax=ax, label='Highest', color='red')
        temp_min.mean(['lat', 'lon']).plot(ax=ax, label='Lowest', color='blue')
        ax.legend()
        ax.set_xlabel('Day')
        ax.set_ylabel(f'Temperature at 2 metres ({attrs["units"]})')
        ax.set_title('Temperature at 2 Metres')

        # Convert plot to PNG
        buf = BytesIO()
        plt.savefig(buf, format='png')
        plt.close(fig)
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        return jsonify({'image': img_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

