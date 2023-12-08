// include openlayer
var mapView = new ol.View ({
    center: ol.proj.fromLonLat([97.16978, 5.11775]),
    zoom: 16,
});

var map = new ol.Map ({
    target: 'map',
    view: mapView,
});

var osmFile = new ol.layer.Tile ({
    title: 'Open Street Map',
    visible: true,
    source: new ol.source.OSM(),
});

map.addLayer(osmFile);
// include openlayer

// Call API Polygon to Web
var createLayer = function(title, layerName) {
    return new ol.layer.Tile({
        title: title,
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/gis/wms',
            params: {'LAYERS': 'gisMnsManyang:' + layerName, 'TILED': true},
            serverType: 'geoserver',
            visible: true
        })
    });
};

var layers = [
    createLayer('Batas Gampong Ulee Blang Mane', 'batas_ulee_blang_mane'),
    createLayer('Jalan', 'jalan'),
    createLayer('Balai Pengajian Polygon', 'balai_pengajian_poligon'),
    createLayer('Balai Pengajian Point', 'balai_pengajian'),
    createLayer('Bengkel Polygon', 'bengkel_poligon'),
    createLayer('Bengkel Point', 'bengkel'),
    createLayer('Got', 'got'),
    createLayer('Jurong', 'jurong'),
    createLayer('Kebun Polygon', 'kebun_poligon'),
    createLayer('Kebun Point', 'kebun'),
    createLayer('Kios Polygon', 'kios_poligon'),
    createLayer('Kios Point', 'kios'),
    createLayer('Kesehatan Polygon', 'kesehatan_poligon'),
    createLayer('Kesehatan Point', 'kesehatan'),
    createLayer('Paya Rabo Polygon', 'paya_rabo_poligon'),
    createLayer('Paya Rabo Point', 'paya_rabo'),
    createLayer('Lapangan Polygon', 'lapangan_poligon'),
    createLayer('Lapangan', 'lapangan'),
    createLayer('Lueng', 'lueng'),
    createLayer('Meunasah Polygon', 'meunasah_poligon'),
    createLayer('Meunasah Point', 'meunasah'),
    createLayer('Kuburan Polygon', 'kuburan_poligon'),
    createLayer('Kuburan Point', 'kuburan'),
    createLayer('Pemerintahan Polygon', 'pemerintahan_poligon'),
    createLayer('Pemerintahan Point', 'pemerintahan'),
    createLayer('Pendidikan Polygon', 'pendidikan_poligon'),
    createLayer('Pendidikan Point', 'pendidikan'),
    createLayer('Rumah Polygon', 'rumah_poligon'),
    createLayer('Rumah Point', 'rumah'),
    createLayer('Rumah Saya Polygon', 'rumah_saya_poligon'),
    createLayer('Rumah Saya Point', 'rumah_saya'),
    createLayer('Sawah Polygon', 'sawah_poligon'),
    createLayer('Sawah Point', 'sawah'),
    createLayer('Rangkang', 'rangkang'),
    createLayer('Tambak Polygon', 'tambak_ikan_poligon'),
    createLayer('Tambak point', 'tambak_ikan'),
    createLayer('Toko Polygon', 'toko_poligon'),
    createLayer('Toko', 'toko'),
    createLayer('Pabrik Padi Polygon', 'pabrik_padi_poligon'),
    createLayer('Pabrik Padi Point', 'pabrik_padi'),
    createLayer('Panglong Polygon', 'panglong_poligon'),
    createLayer('Panglong Point', 'panglong'),
    createLayer('Bapas Kelas 2 Polygon', 'bapas_kelas_2_lhokseumawe_poligon'),
    createLayer('Bapas Kelas 2 Point', 'bapas kelas 2 lhokseumawe'),
    createLayer('Bank Polygon', 'bank_poligon'),
    createLayer('Bank Point', 'bank'),
    createLayer('Alue', 'alues'),
    createLayer('Bulog Sub Divisi Lhokseumawe Polygon', 'bulog_sub_divisi_regional_lhokseumawe_poligon'),
    createLayer('Bulog Sub Divisi Lhokseumawe Point', 'bulog_sub_divisi_regional_lhokseumawe'),
    createLayer('Futsal Sehat Polygon', 'sehat_futsal_poligon'),
    createLayer('Futsal Sehat Point', 'sehat_futsal'),
    
];

layers.forEach(function(layer) {
    map.addLayer(layer);
});
// Call API Polygon to Web

// Create popup to switch layer
var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: false,
    groupSelectStyle: 'children'
});

map.addControl(layerSwitcher);
// Create popup to switch layer

// Create popup Info layer
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoAnimation: {
        duration: 250
    }
});

map.addOverlay(popup);

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};
// Create popup Info layer

// Function to handle common logic for creating and displaying popup layers
function handlePopupLayer(layerName, featureInfoProperties, extraProperties = {}) {
    map.on('singleclick', function (evt) {
        content.innerHTML = '';
        var resolution = mapView.getResolution();
        var url = createLayer(layerName, layerName.toLowerCase()).getSource().getFeatureInfoUrl(evt.coordinate, resolution, 'EPSG:3857', {
            'INFO_FORMAT': 'application/json',
            'propertyName': featureInfoProperties
        });

        if (url) {
            console.log(url);
            $.getJSON(url, function (data) {
                var feature = data.features[0];
                var props = feature.properties;
                var popupContent = Object.entries(extraProperties).map(([key, label]) => `<h3> ${label} : </h3> <p>${props[key]}</p> <br>`).join(' ');
                content.innerHTML = popupContent;
                popup.setPosition(evt.coordinate);
            });
        } else {
            popup.setPosition(undefined);
        }
    });
}

// Call Action popup layer Rumah Sendiri
handlePopupLayer('Rumah Sendiri', 'nama');

// Call Action popup layer Balai Pengajian
handlePopupLayer('Balai_Pengajian', 'name,teungku', { 
    'name': 'Nama Balai Pengajian', 
    'teungku': 'Nama Teungku' 
});

// Call Action popup layer Bengkel
handlePopupLayer('Bengkel', 'name', { 'name': 'Name Bengkel' });

// Call Action popup layer Rumah
handlePopupLayer('Rumah', 'no_rumah,pemilik,no_ktp,telepon,penghuni,ktp,laki_laki,perempuan,total', {
    'pemilik': 'Nama Pemilik',
    'no_ktp': 'Ktp Pemilik',
    'telepon': 'No Telepon',
    'penghuni': 'Nama Penghuni',
    'ktp': 'Ktp Penghuni',
    'laki_laki': 'Jumlah Penghuni Laki-Laki',
    'perempuan': 'Jumlah Penghuni Perempuan',
    'total': 'Total Penghuni'
});

// Call Action popup layer Gudang
handlePopupLayer('Gudang', 'pemilik,name,simpan', { 
    'pemilik': 'Nama Pemilik', 
    'name': 'Nama Gudang', 
    'simpan': 'Isi' });

// Call Action popup layer Kandang
handlePopupLayer('Kandang', 'name', { 'name': 'Nama kandang' });

// Call Action popup layer Kebun
handlePopupLayer('Kebun', 'name', { 'name': 'Nama Kebun' });

// Call Action popup layer Kedai
handlePopupLayer('Kedai', 'name', { 'name': 'Nama Kedai' });

// Call Action popup layer Kesehatan
handlePopupLayer('Kesehatan', 'nama', { 'nama': 'Nama Kesehatan' });

// Call Action popup layer Kios
handlePopupLayer('Kios', 'pemilik,jenis,name', { 
    'pemilik': 'Nama Pemilik', 
    'name': 'Nama Kedai', 
    'jenis': 'Jenis Kedai' 
});

// Call Action popup layer Lahan Kosong
handlePopupLayer('Lahan_kosong', 'name', { 'name': 'Nama Pemilik' });

// Call Action popup layer Lapangan
handlePopupLayer('Lapangan', 'nama,pemilik', { 
    'nama': 'Nama Lapangan', 
    'pemilik': 'Hak Milik' 
});

// Call Action popup layer Masjid
handlePopupLayer('Masjid', 'nama', { 'nama': 'Nama Mesjid' });

// Call Action popup layer Pemerintahan
handlePopupLayer('Pemerintahan', 'geuchik,nama', { 
    'geuchik': 'Nama Geuchik', 
    'nama': 'Nama Kantor' 
});

// Call Action popup layer Meunasah
handlePopupLayer('Meunasah', 'nama,pemilik', { 
    'nama': 'Nama Meunasah', 
    'pemilik': 'Hak Milik' 
});

// Call Action popup layer Pendidikan
handlePopupLayer('Pendidikan', 'name', { 'name': 'Nama Pendidikan' });

// Call Action popup layer Pos Jaga
handlePopupLayer('Pos_Jaga', 'name', { 'name': 'Nama Post Jaga' });

// Call Action popup layer Rangkang
handlePopupLayer('Rangkang', 'name', { 'name': 'Nama Rangkang' });

// Call Action popup layer Rawa Rawa
handlePopupLayer('Rawa_Rawa', 'name', { 'name': 'Nama Rawa Rawa' });

// Call Action popup layer Sawah
handlePopupLayer('Sawah', 'pemilik,luas', { 
    'pemilik': 'Pemilik', 
    'luas': 'Luas Sawah' 
});

// Call Action popup layer Tambak
handlePopupLayer('Tambak', 'pemilik,jenis', { 
    'pemilik': 'Nama Pemilik', 
    'jenis': 'Jenis Budidaya' 
});

// Call Action popup layer Toko
handlePopupLayer('Toko', 'nama,pemilik,jenis', { 
    'nama': 'Nama Toko', 
    'jenis': 'Jenis Toko', 
    'pemilik': 'Nama Pemilik' 
});

// Call Action popup layer Usaha
handlePopupLayer('Usaha', 'name', { 'name': 'Nama Usaha' });