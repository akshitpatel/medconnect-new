'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaChevronDown, FaSearch, FaLocationArrow, FaMapMarkedAlt } from 'react-icons/fa';
import Image from 'next/image';

// API endpoint for location services
const LOCATION_API_ENDPOINT = '/api/locations';

// Gujarat cities and areas - this would come from our API in production
const GUJARAT_CITIES = [
  { 
    name: 'Ahmedabad', 
    district: 'Ahmedabad', 
    areas: [
      'Navrangpura', 'Satellite', 'Bopal', 'Thaltej', 'CG Road', 'Maninagar', 
      'Vastrapur', 'Paldi', 'Ambawadi', 'Bodakdev', 'Chandkheda', 'Shilaj', 
      'Gota', 'South Bopal', 'Motera', 'Naranpura', 'Sabarmati', 'Ranip', 
      'Jodhpur', 'Prahlad Nagar', 'Science City', 'Shela', 'Sarkhej', 'Vaishnodevi',
      'Ghatlodiya', 'Sola', 'New Ranip', 'Chandlodia', 'Naroda', 'Odhav',
      'Vastral', 'Nikol', 'Bapunagar', 'Krishnanagar', 'Shahibaug', 'Asarwa'
    ] 
  },
  { 
    name: 'Surat', 
    district: 'Surat', 
    areas: [
      'Adajan', 'Citylight', 'Vesu', 'Athwa', 'Katargam', 'Varachha', 
      'Piplod', 'Pal', 'Palanpur', 'Althan', 'Bhatar', 'Udhna', 
      'Pandesara', 'Sachin', 'Olpad', 'Dumas', 'Rander', 'Jahangirpura',
      'Amroli', 'Utran', 'Mota Varachha', 'Kamrej', 'Laskana', 'New City Light',
      'Magdalla', 'Dindoli', 'Bamroli', 'Kosad', 'Godadara', 'Sarthana'
    ] 
  },
  { 
    name: 'Vadodara', 
    district: 'Vadodara', 
    areas: [
      'Alkapuri', 'Sayajigunj', 'Karelibaug', 'Akota', 'Gorwa', 'Manjalpur', 
      'Vasna', 'Waghodia Road', 'Nizampura', 'Fatehgunj', 'Sama', 'Subhanpura', 
      'Makarpura', 'Tandalja', 'Gotri', 'Harni', 'Tarsali', 'Diwalipura',
      'Atladara', 'Chhani', 'Ajwa Road', 'Jetalpur', 'OP Road', 'Pratapnagar',
      'Vadsar', 'Bhayli', 'Sevasi', 'Vemali', 'Kalali', 'Warasia'
    ] 
  },
  { 
    name: 'Rajkot', 
    district: 'Rajkot', 
    areas: [
      'Kalawad Road', 'University Road', 'Raiya Road', 'Gondal Road', 'Mavdi', 
      'Nana Mava', 'Karanpara', 'Race Course', 'Sadhuvasvani Road', 'Amin Marg', 
      '150 Feet Ring Road', 'Pedak Road', 'Kothariya', 'Jivraj Park', 'Sorathiyawadi',
      'Astron Chowk', 'Trikon Baug', 'Gandhigram', 'Ramapir Chowkdi', 'Chandreshnagar',
      'Metoda', '80 Feet Road', 'Kuvadva Road', 'Indraprasth', 'Panchayat Nagar',
      'Raiya Dhar', 'KKV Hall', 'Shashtrinagar', 'Virani Chowk', 'Madhapar'
    ] 
  },
  { 
    name: 'Gandhinagar', 
    district: 'Gandhinagar', 
    areas: [
      'Sector 1-30', 'Infocity', 'Kudasan', 'Sargasan', 'Pethapur', 
      'Koba', 'Randesan', 'Vavol', 'Adalaj', 'Raysan', 'Uvarsad', 
      'Kolavada', 'Palaj', 'Lekavada', 'Mansa', 'Indroda', 'Dholakuva',
      'GIFT City', 'Chandkheda Extension', 'Ambika Nagar', 'Valad', 'Reliance Chokdi',
      'Dehgam Road', 'Dholera Expressway', 'Chiloda Circle', 'Aashram Road',
      'Pathika Ashram', 'Kalol Highway', 'Santej', 'Mahudi Road'
    ] 
  },
  { 
    name: 'Jamnagar', 
    district: 'Jamnagar', 
    areas: [
      'Patel Colony', 'Ranjit Nagar', 'Gokul Nagar', 'Moti Khavdi',
      'Digvijay Plot', 'Jamnagar Town', 'Khodiyar Colony', 'Jalaram Society',
      'Jam Khambhaliya Road', 'Gulab Nagar', 'Pancheshwar Tower', 'Bedeshwar',
      'Shivaji Nagar', 'Saru Section', 'Vora Kothar', 'Joggers Park', 'KK Nagar', 
      'Sardarnagar', 'Reliance Township', 'Dhichda', 'Gandhigram', 'Sarovar Plots',
      'Indira Nagar', 'Aerodrome Circle', 'Lal Bungalow', 'Pratap Nagar',
      'Navagam', 'Raviratna Park', 'Crystal Mall', 'Motikhavdi Refinery'
    ] 
  },
  { 
    name: 'Bhavnagar', 
    district: 'Bhavnagar', 
    areas: [
      'Waghawadi Road', 'Kaliyabid', 'Ghogha Circle', 'Crescent',
      'Mahila College', 'Nilambaug', 'Sardarnagar', 'Shishuvihar',
      'Rupani', 'Sanatorium', 'New Timber Market', 'Vijayrajnagar',
      'Anandnagar', 'Akwada', 'Fulsar', 'Vadva', 'Subhashnagar', 'Takhteshwar',
      'Chitra', 'Karagnagar', 'Vidyanagar', 'Bhavnagar City', 'Atabhai Chowk',
      'Vallabhbhai Nagar', 'Kukuwada', 'Sidsar', 'Bhojrajpara', 'Devgana',
      'Jahapura', 'Vartej', 'Ghogha Port'
    ] 
  },
  { 
    name: 'Junagadh', 
    district: 'Junagadh', 
    areas: [
      'Zanzarda Road', 'Kalwa Chowk', 'MG Road', 'Girnar Road',
      'Dolatpara', 'Joshipura', 'Sardar Baug', 'Kalwa Gate',
      'Vanthali Gate', 'College Road', 'Dhal Road', 'Datar Road',
      'Sakkar Baug', 'Majewadi', 'Gayatri Nagar', 'Talav Gate',
      'Lal Darwaja', 'Bhavnath', 'Junagadh City', 'Visavadar Road',
      'Girnar Hills', 'Sapakara Mill', 'Mandvi Chowk', 'Dhobi Chowk',
      'Azad Chowk', 'Motibag', 'Bilkha Road', 'Majevadi Gate',
      'Timbavadi', 'Divyapuri'
    ] 
  },
  { 
    name: 'Anand', 
    district: 'Anand', 
    areas: [
      'Vidyanagar', 'Gamdi', 'Vallabh Vidyanagar', 'Karamsad',
      'Jyotica Park', 'Shantinagar', 'Iskon Temple Road', 'Sardargunj',
      'Ganadevispura', 'College Road', 'GIDC', 'Amul Dairy Road',
      'Station Road', 'Mahadev Area', 'Bombay Shopping Center', 'Nana Bazaar',
      'Chikhodra', 'Mogri', 'New Bus Stand', 'Anand Main Town',
      'IRMA Campus', 'Bakrol', 'Ode', 'Lambhvel Road',
      'Jain Derasar Road', 'Ganesh Crossing', 'Borsad Chowkdi', 'Amin Road',
      'Dharmaj Road', 'Vadtal Road'
    ] 
  },
  { 
    name: 'Navsari', 
    district: 'Navsari', 
    areas: [
      'Lunsikui', 'Chhapra', 'Jalalpore', 'Dudhia Talav',
      'Mahadev Street', 'Mota Bazaar', 'Tower Road', 'Station Road',
      'Vijay Nagar', 'Gangadhara', 'Nehru Nagar', 'Machhiwad',
      'Pardi Road', 'Swagatam Circle', 'Gandhi Nagar', 'Apollo Circle',
      'Pipalgaon', 'Navsari City', 'Kalvach Circle', 'Raopura',
      'Mahuva Road', 'Kalvach Road', 'Chikhli Road', 'Jalaramnagar',
      'Kabilpore', 'Bhutnath Mandir', 'Timaliawad', 'Makarpur',
      'Dandi Road', 'Sadbhavna Circle'
    ] 
  },
  { 
    name: 'Mehsana', 
    district: 'Mehsana', 
    areas: [
      'Highway Road', 'Radhanpur Road', 'Modhera Road', 'Palavasna',
      'Tower Road', 'College Road', 'Nagalpur Road', 'Ganesh Crossing',
      'Rajmahal Road', 'Soniwad', 'Mehsana City', 'Borisana',
      'GIDC Area', 'Bus Station Road', 'Bhagwat Nagar', 'Panchvati',
      'Modinagar', 'Gayatrinagar', 'Ambaji Temple Road', 'Shanti Nagar',
      'Dholasan Road', 'Visnagar Road', 'Mevad', 'Nagalpur',
      'Unava', 'Sardar Patel Colony', 'M J Library Road', 'Sardarnagar',
      'Industrial Area', 'Vijapur Road'
    ] 
  },
  { 
    name: 'Porbandar', 
    district: 'Porbandar', 
    areas: [
      'Marine Drive', 'Chowpatty', 'Kadiyavad', 'Chhaya',
      'Dwarka Road', 'Kirti Mandir Area', 'Port Area', 'College Road',
      'Chakratirth Road', 'Market Area', 'Porbandar City', 'Chowpati',
      'MG Road', 'Sudama Chowk', 'Krishna Nagar', 'Shivaji Nagar',
      'Gandhi Colony', 'Indira Nagar', 'Nehru Nagar', 'Birla Circle',
      'Bharat Nagar', 'Adityana Road', 'Ranavav Road', 'Kamlabaug',
      'Khimeshwar Nagar', 'Udyognagar', 'Subhashnagar', 'Bhavsinhji Road',
      'Hanuman Madhi', 'Daria Nagar'
    ] 
  },
  { 
    name: 'Patan', 
    district: 'Patan', 
    areas: [
      'Rajmahal Road', 'Station Road', 'Siddhpur Road', 'Chanasma Highway',
      'Chansma Gate', 'Dharmsinh Desai Road', 'Guglie', 'Kalanala',
      'Patan City', 'Darwaja Circle', 'Patolawadi', 'Bhadra Road',
      'Rani ki Vav Area', 'Salvivad', 'Trikam Nagar', 'Shantinagar',
      'Shivraj Nagar', 'Raja Mahal', 'College Road', 'Nagalpur Highway',
      'Thakor Colony', 'Verai Mata Road', 'Ahmedabad Highway', 'Gandhi Street',
      'Taran Talav', 'Anand Nagar', 'Ambika Nagar', 'Jayanti Nagar',
      'Dairy Road', 'Vishnu Nagar'
    ] 
  },
  { 
    name: 'Nadiad', 
    district: 'Kheda', 
    areas: [
      'Santram Road', 'College Road', 'Station Road', 'Uttar Gujarat',
      'Nadiad City', 'Jitodiya', 'Santram Temple Area', 'Mahadevpura',
      'Sheth C M High School Road', 'Motikaka Circle', 'Bhuyangdev',
      'Danteshwar', 'College Circle', 'Chhotalal Desai Road', 'Pij Road',
      'Vaikunth Society', 'Kanjoda', 'Manjipura', 'Mahadev Road',
      'Traj Temple Road', 'Shivaji Road', 'Pij Crossing', 'Kanjoda Road',
      'Hari Om Nagar', 'Gokul Society', 'Indira Gandhi Statue Road',
      'CB Patel Road', 'Gayatri Temple Road', 'Sardar Patel Road',
      'Bhraman Society'
    ] 
  },
  { 
    name: 'Morbi', 
    district: 'Morbi', 
    areas: [
      'Sanala Road', 'Raiya Road', 'Lakhdirji Road', 'Tankara',
      'Morbi City', 'Morbi Main Bazaar', 'Kandoi Street', 'GIDC Area',
      'Nazarbaug', 'Satelite', 'Ravapar Road', 'Madhapar Road',
      'Chitrakut Society', 'Mahavir Nagar', 'Indira Nagar', 'Ravapar Crossroads',
      'Bhudia Road', 'Tanga Road', 'Halvad Road', 'Jodhpur Crossroads',
      'Ceramic Zone', 'Ghanshyam Nagar', 'Vajdi', 'Sardar Nagar',
      'Railway Station Road', 'Tower Chowk', 'Paneli Road', 'Lajai Circle',
      'Wadhwan-Morbi Road', 'Lilapar Road'
    ] 
  },
  { 
    name: 'Bharuch', 
    district: 'Bharuch', 
    areas: [
      'Zadeshwar Road', 'Shaktinath', 'GIDC', 'Ankleshwar',
      'Station Road', 'Dandia Bazar', 'Panchbatti', 'Kasak Circle',
      'Bharuch City', 'Bholav', 'J.P. Road', 'Seva Ashram Road',
      'Bharuch-Dahej Road', 'Nandevan', 'AT Road', 'VijayNagar',
      'Valia Road', 'Jambusar Road', 'Bholav Circle', 'Sevashram Circle',
      'Kasak', 'Golden Bridge Area', 'Narmada Apartment', 'Civil Lines',
      'Sajjan Mill', 'Link Road', 'Bharuch-Ankleshwar Road', 'Tarsali',
      'Ghega Deva Road', 'Dahej GIDC'
    ] 
  },
  { 
    name: 'Vapi', 
    district: 'Valsad', 
    areas: [
      'GIDC', 'Chala', 'Chanod', 'Dungra', 'Vapi Town',
      'Char Rasta', 'Koparli', 'Gunjan', 'Daman Road',
      'Valsad Road', 'Silvassa Road', 'Chharwada Road', 'Fali',
      'Balitha', 'Papdi', 'Segvi', 'Bhilad', 'Salvav',
      'Vapi Main', 'Pardi', 'Udwada Road', 'Damanganga',
      'Dabhel', 'Kachigam', 'Sarigam', 'Karvad',
      'Vapi Station', 'Dunetha', 'Namdapore', 'Phase III GIDC'
    ] 
  },
  { 
    name: 'Godhra', 
    district: 'Panchmahal', 
    areas: [
      'Station Road', 'Lunawada Road', 'Dahod Road', 'Vadodara Road',
      'Godhra City', 'Panchmahal', 'Champaner Gate', 'Bapatwada',
      'Hospital Road', 'Anklav', 'Signal Faliya', 'Govindi',
      'Railway Colony', 'Satpul', 'College Road', 'Polan Bazaar',
      'Tower Road', 'Paldi', 'Raghunathpura', 'Ramganj',
      'Kapadvanj Road', 'Ahmedabad Road', 'Vejalpur Road', 'Halol Road',
      'Gandhi Nagar', 'Indira Nagar', 'Juna Bazar', 'Prabha Road',
      'Shivnagar', 'Vishram Nagar'
    ] 
  },
  { 
    name: 'Amreli', 
    district: 'Amreli', 
    areas: [
      'Tower Road', 'Lathi Road', 'Chakkargadh Road', 'Rajula Road',
      'Amreli City', 'Mahuva Road', 'Chalala Road', 'Savarkundla Road',
      'Babra Road', 'Liliya Road', 'Kumbharvada', 'Bhidekotha',
      'Giriraj', 'Ramji Mandir', 'Tower Chowk', 'Sadar Bazar',
      'Kotadi', 'Shree Colony', 'Main Bazar', 'Jalaram Chowk',
      'Ganesh Nagar', 'Krishna Nagar', 'Rajkot Road', 'Civil Hospital Road',
      'Divya Jyot Society', 'Narsinh Mehta Chowk', 'Rampara Road', 'Lathi Gate',
      'Madhavdarshan Society', 'Ratanpar Road'
    ] 
  },
  { 
    name: 'Valsad', 
    district: 'Valsad', 
    areas: [
      'Tithal Road', 'Dharampur Road', 'Abrama', 'Station Road',
      'Valsad City', 'Town Hall Road', 'Halar Road', 'Swami Narayan Temple Road',
      'Atul Road', 'Dairy Road', 'Garib Nawaz Society', 'Nani Khatriwad',
      'Nanakwada', 'Market Road', 'Mograwadi', 'Jalaram Nagar',
      'Bhagdawada', 'Gokul Nagar', 'Nanapondha', 'Tithal Beach Road',
      'Vrindavan Society', 'College Road', 'Cinema Road', 'Tower Road',
      'Pardi Road', 'Bhilad Road', 'Segvi Road', 'Panchvati',
      'Surkhai Road', 'Vadodara Road'
    ] 
  },
  { 
    name: 'Palanpur', 
    district: 'Banaskantha', 
    areas: [
      'Joravarnagar', 'Aroma Circle', 'Kanthi Bazaar', 'LG Hospital Road',
      'Palanpur City', 'Laxmipura', 'Balisana Road', 'Ramnagar',
      'Sherpura', 'Bhavishya Nagar', 'Old City', 'Gurunanak Society',
      'Saraswati Nagar', 'Deesa Highway', 'Jagana Road', 'Banaskantha GIDC',
      'Ambaji Highway', 'Abu Highway', 'Kirti Stambh Area', 'Civil Hospital Area',
      'Railway Station Road', 'Collector Office Road', 'Rambaug', 'Gandhi Chowk',
      'Shivshakti Society', 'PD Pandya College Area', 'Patan Highway', 'Junaraj',
      'Highway Colony', 'New Laxmipura'
    ] 
  },
  { 
    name: 'Veraval', 
    district: 'Gir Somnath', 
    areas: [
      'Port Area', 'Chowpati', 'Madhavpur', 'Somnath Highway',
      'Veraval City', 'Bunder Road', 'Tower Road', 'Fish Market Area',
      'College Road', 'Timbavadi Gate', 'Junagadh Road', 'Mangrol Road',
      'Mithapur', 'Prabhas Patan', 'Haripur', 'Madhavpur Beach',
      'Somnath Temple Road', 'Hospital Road', 'Talala Road', 'Kharwa Chowk',
      'Keshod Highway', 'Old Port Area', 'Fisheries College', 'Bhidiya Plot',
      'Shree Colony', 'Adarsh Nagar', 'Bhavnagar Colony', 'Sea Face Road',
      'Kirti Temple Road', 'Jalaram Society'
    ] 
  },
  { 
    name: 'Dwarka', 
    district: 'Devbhumi Dwarka', 
    areas: [
      'Temple Area', 'Gomti Ghat', 'Rupen Gate', 'Bhadrakali Road',
      'Dwarka City', 'Beyt Dwarka Road', 'Rajiv Gandhi Street', 'Swaminarayan Temple Road',
      'Gayatri Mandir Road', 'Dwarkadhish Temple', 'Chowpatty', 'Sunset Point',
      'Lighthouse Area', 'Bhadkeshwar Mahadev', 'Beach Road', 'Market Road',
      'Jamnagar Highway', 'Porbandar Road', 'Khambhaliya Road', 'Dhrol Road',
      'Nageshwar Road', 'Okha Road', 'Gopi Talav', 'Panchnath Mahadev Temple',
      'Station Road', 'Mithapur Road', 'Gorinja', 'Shivrajpur',
      'Somnath Highway', 'Ambaji Temple Road'
    ] 
  },
  { 
    name: 'Anjar', 
    district: 'Kutch', 
    areas: [
      'Anjar City', 'Varshamedi', 'Galpadar Road', 'Gandhidham Highway',
      'GIDC Area', 'Hill Garden', 'Adipur Road', 'New Anjar',
      'Ratnal Society', 'Vachraj Nagar', 'Sherpura', 'Bhimasar GIDC',
      'Nagalpar', 'Madhapar', 'Vidi Vistar', 'Khedoi',
      'Matiya Madhi', 'Old City Area', 'Temkar Naka', 'Station Road',
      'Bus Station Area', 'Ganeshpura', 'Sinhan Naka', 'College Road',
      'Vidi-vistar Colony', 'GETCO Colony', 'Industrial Area', 'Adinath Society',
      'Ambika Nagar', 'New Sardar Nagar'
    ] 
  },
  { 
    name: 'Khambhat', 
    district: 'Anand', 
    areas: [
      'Khambhat City', 'Tarapur Road', 'Beach Road', 'Port Area',
      'Tower Street', 'Kasba', 'Lal Darwaja', 'Shahapur Gate',
      'Vakhatpur Gate', 'Mehrajpura', 'Hanumanpura', 'Jambusar Road',
      'Petlad Road', 'Anand Highway', 'Vataman Road', 'Undel Road',
      'Gothada', 'Rampura', 'Bhaijipura', 'Saiyad Pura',
      'Vadgam', 'Shiyalbet', 'Mangrol Road', 'Clock Tower Area',
      'Navlakhi Temple Road', 'Jama Masjid Road', 'Nawabganj', 'Bhadkodra',
      'Amod Road', 'Sayedpura'
    ] 
  },
  { 
    name: 'Dahod', 
    district: 'Dahod', 
    areas: [
      'Dahod City', 'Station Road', 'Civil Lines', 'Godhra Road',
      'Fatehpura', 'Jhalod Road', 'Baria Road', 'Tower Chowk',
      'GIDC Area', 'Limkheda Road', 'Chandrapura Gate', 'Rajendra Park',
      'Moti Bazar', 'Garbada Road', 'Sanjeli Road', 'College Road',
      'Chakaliya Road', 'Hadapti Road', 'Railway Colony', 'Prabha Road',
      'Dudhia Road', 'Baxi Colony', 'Fagvel Road', 'Ratanpura',
      'AV Road', 'Signal Faliya', 'Pipadara Road', 'Kotwali Road',
      'Vaniyawad', 'Kothi Road'
    ] 
  },
  { 
    name: 'Botad', 
    district: 'Botad', 
    areas: [
      'Botad City', 'Tower Road', 'Gadhada Road', 'Paliyad Road',
      'Ranpur Road', 'Barwala Road', 'Bhavnagar Road', 'Dhasa Road',
      'Old Bus Stand', 'New Bus Stand', 'GIDC Area', 'College Road',
      'Railway Station Road', 'Civil Hospital Road', 'Shetrunji Dam Road', 'Market Yard',
      'Darbargarh', 'Hadala Road', 'Nava Samadhiyala', 'Tana',
      'Sarangpur Road', 'Rajkot Highway', 'Jamka Road', 'Vallabhipur Highway',
      'Sheth Society', 'Chamunda Society', 'Saurashtra Society', 'Ramapir Temple Road',
      'Krishna Nagar', 'Sardar Nagar'
    ] 
  },
  { 
    name: 'Jetpur', 
    district: 'Rajkot', 
    areas: [
      'Jetpur City', 'Gondal Road', 'Tower Road', 'Dhoraji Road',
      'Virpur Road', 'Junagadh Road', 'Upleta Road', 'Navagadh Road',
      'GIDC Area', 'Industrial Area', 'Govindpara', 'Dhebar Road',
      'Bhaktinagar', 'Prabhudas Talav', 'Darbar Gadh', 'Sardar Baug',
      'College Road', 'Jail Road', 'Bhagvatpara', 'Gokuldham Society',
      'Old Bus Stand', 'New Bus Stand', 'Station Road', 'Jani Vas',
      'Sukhnath Chowk', 'Rang Upvan', 'Rajeshwari Society', 'Indira Nagar',
      'Madhapar', 'Bordi Gate'
    ] 
  },
  { 
    name: 'Somnath', 
    district: 'Gir Somnath', 
    areas: [
      'Temple Road', 'Beach Road', 'Veraval Highway', 'Prabhas Patan',
      'Somnath City', 'Bhalka Tirth Road', 'Triveni Sangam', 'Gita Mandir Road',
      'Bypass Road', 'Dehotsarg Tirth', 'Junagadh Road', 'Chorwad Road',
      'Prasang Vadi', 'Shree Society', 'SH-27 Highway', 'Nandan Van',
      'Jesal Park', 'Savitri Heritage', 'Suraj Kund Road', 'Adhar Dham',
      'Kamnath Mahadev', 'Kesar Bhavan', 'Guest House Area', 'Bus Station Road',
      'Tulsi Shyam', 'Lakshmi Narayan Temple', 'Patan Gate', 'Bhidbhanjan',
      'Saudagar Street', 'Harihar Van'
    ] 
  }
];

// Postal codes - this would come from our API in production
const GUJARAT_POSTAL_CODES = [
  { code: '380001', area: 'Navrangpura, Ahmedabad' },
  { code: '380015', area: 'Satellite, Ahmedabad' },
  { code: '395007', area: 'Adajan, Surat' },
  { code: '395009', area: 'Vesu, Surat' },
  { code: '390001', area: 'Alkapuri, Vadodara' },
  { code: '390020', area: 'Manjalpur, Vadodara' },
  { code: '360001', area: 'Kalawad Road, Rajkot' },
  { code: '382010', area: 'Sector 1-5, Gandhinagar' },
  { code: '385001', area: 'Joravarnagar, Palanpur' },
  { code: '362265', area: 'Temple Area, Somnath' },
  { code: '362001', area: 'Port Area, Veraval' },
  { code: '361335', area: 'Temple Area, Dwarka' },
  { code: '370110', area: 'Anjar City, Anjar' },
  { code: '388620', area: 'Khambhat City, Khambhat' },
  { code: '389151', area: 'Dahod City, Dahod' },
  { code: '364710', area: 'Botad City, Botad' },
  { code: '360370', area: 'Jetpur City, Jetpur' },
  { code: '364001', area: 'Bhavnagar City, Bhavnagar' },
  { code: '364002', area: 'Nilambaug, Bhavnagar' },
  { code: '360575', area: 'Madhapar, Rajkot' },
  { code: '380061', area: 'Motera, Ahmedabad' },
  { code: '395017', area: 'Varachha, Surat' },
  { code: '390005', area: 'Akota, Vadodara' }
];

interface LocationSelectorProps {
  onLocationChange?: (location: string) => void;
  region?: string;
  defaultLocation?: string;
}

interface CityData {
  name: string;
  district: string;
  areas: string[];
}

interface PostalCode {
  code: string;
  area: string;
}

export default function LocationSelector({ onLocationChange, region = 'Gujarat', defaultLocation }: LocationSelectorProps) {
  const [location, setLocation] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<CityData[]>(GUJARAT_CITIES);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Load location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    } else if (defaultLocation) {
      setLocation(defaultLocation);
    } else {
      // Try to get user's location automatically on first load
      tryGetGeolocation();
    }
  }, [defaultLocation]);
  
  // Filter locations based on search query and selected district
  useEffect(() => {
    if (!searchQuery && !selectedDistrict) {
      setFilteredLocations(GUJARAT_CITIES);
      return;
    }

    let filtered = [...GUJARAT_CITIES];
    
    // Filter by district if selected
    if (selectedDistrict) {
      filtered = filtered.filter(city => city.district === selectedDistrict);
    }
    
    // Filter by search query (city name, area, or postal code)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      
      // Check if searching for a postal code
      const postalCodeMatches = GUJARAT_POSTAL_CODES.filter(pc => 
        pc.code.includes(searchLower) || pc.area.toLowerCase().includes(searchLower)
      );
      
      // Find matches in city names and areas
      const cityMatches = filtered.filter(city => {
        // Match city name
        if (city.name.toLowerCase().includes(searchLower)) return true;
        
        // Match district
        if (city.district.toLowerCase().includes(searchLower)) return true;
        
        // Match areas within the city
        if (city.areas.some(area => area.toLowerCase().includes(searchLower))) return true;
        
        return false;
      });
      
      // If postal code matches, show those first
      if (postalCodeMatches.length > 0) {
        // Find the corresponding cities
        const postalCodeCities = postalCodeMatches.map(pc => {
          const cityName = pc.area.split(',')[1]?.trim() || '';
          return GUJARAT_CITIES.find(c => c.name === cityName);
        }).filter((city): city is CityData => city !== undefined);
        
        // Combine postal code matches with city matches, removing duplicates
        const cityMatchesWithoutDuplicates = cityMatches.filter(city => 
          !postalCodeCities.some(pc => pc.name === city.name)
        );
        
        filtered = [...postalCodeCities, ...cityMatchesWithoutDuplicates];
      } else {
        filtered = cityMatches;
      }
    }
    
    setFilteredLocations(filtered);
  }, [searchQuery, selectedDistrict]);
  
  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Try to get user's geolocation
  const tryGetGeolocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In a real implementation, this would be a call to our API:
            // const response = await fetch(
            //   `${LOCATION_API_ENDPOINT}/geocode?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
            // );
            // const data = await response.json();
            // if (data.city) {
            //   handleLocationSelect(data.city, data.area);
            // }

            // For demo purposes, simulate API response with a delay
            setTimeout(() => {
              // Check if coordinates are roughly in Gujarat (approximate)
              const isInGujarat = position.coords.latitude >= 20 && position.coords.latitude <= 24.5 &&
                                 position.coords.longitude >= 68 && position.coords.longitude <= 74.5;
              
              if (isInGujarat) {
                // Simulate finding a city in Gujarat based on geolocation
                const randomIndex = Math.floor(Math.random() * GUJARAT_CITIES.length);
                const randomCity = GUJARAT_CITIES[randomIndex];
                const randomArea = randomCity.areas[Math.floor(Math.random() * randomCity.areas.length)];
                handleLocationSelect(`${randomArea}, ${randomCity.name}`);
              } else {
                // Default to a major city in Gujarat
                handleLocationSelect('Navrangpura, Ahmedabad');
              }
              setIsLoading(false);
            }, 1000);
          } catch (error) {
            console.error('Error during reverse geocoding:', error);
            setError('Could not determine your location');
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Location access denied');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setIsLoading(false);
    }
  };
  
  // Handle location selection from dropdown
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setIsOpen(false);
    localStorage.setItem('userLocation', selectedLocation);
    
    // Dispatch custom event for other components
    const event = new CustomEvent('locationChanged', { 
      detail: { location: selectedLocation } 
    });
    window.dispatchEvent(event);
    
    // Call the callback if provided
    if (onLocationChange) {
      onLocationChange(selectedLocation);
    }
  };

  // Handle district selection
  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district === selectedDistrict ? null : district);
  };

  // Toggle between list and map view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  };

  // Get list of districts from cities data
  const districts = Array.from(new Set(GUJARAT_CITIES.map(city => city.district))).sort();
  
  return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-2.5 py-1.5 rounded-md border border-gray-100 bg-white/90 hover:bg-medical-teal-50 text-sm transition-colors group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaMapMarkerAlt className="mr-1 text-medical-teal-600 group-hover:scale-110 transition-transform duration-200" />
        <span className="max-w-[120px] truncate font-medium text-gray-800 group-hover:text-medical-teal-700">
          {isLoading ? 'Locating...' : (location || `Select location in ${region}`)}
          </span>
        <FaChevronDown className={`ml-1 text-xs text-medical-teal-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
        <div className="absolute mt-1 w-80 bg-white rounded-md shadow-lg border border-gray-100 z-50 right-0 sm:right-auto">
          <div className="p-2.5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                {region} Location
              </h3>
              <button 
                onClick={toggleViewMode}
                className="flex items-center justify-center p-1 text-xs text-medical-teal-600 hover:text-medical-teal-700 hover:bg-medical-teal-50 rounded transition-colors"
                title={viewMode === 'list' ? 'Switch to map view' : 'Switch to list view'}
              >
                {viewMode === 'list' ? <FaMapMarkedAlt className="w-4 h-4" /> : <FaSearch className="w-4 h-4" />}
              </button>
            </div>
            
              <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -mt-2 text-medical-teal-400" />
                <input
                ref={searchInputRef}
                  type="text"
                placeholder="Search by city, area, or postal code"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-teal-500 focus:border-medical-teal-500 text-gray-700 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            
            {/* Use current location button */}
            <button 
              className="mt-2 w-full flex items-center justify-center px-3 py-1.5 text-xs text-medical-teal-600 hover:text-medical-teal-700 bg-medical-teal-50 hover:bg-medical-teal-100 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                tryGetGeolocation();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block h-3 w-3 rounded-full border-2 border-medical-teal-600 border-r-transparent animate-spin mr-1.5"></span>
              ) : (
                <FaLocationArrow className="mr-1.5" />
              )}
              {isLoading ? 'Getting location...' : 'Use my current location'}
            </button>
            
            {/* Show error if any */}
            {error && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          {viewMode === 'map' ? (
            <div className="p-2 h-[250px] relative flex items-center justify-center">
              {/* In production, we would integrate a real interactive map with pins for each city */}
              <div className="relative w-full h-full overflow-hidden rounded">
                <Image 
                  src="/gujarat-map.svg" 
                  alt="Map of Gujarat" 
                  width={500} 
                  height={300}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent">
                  <div className="absolute bottom-2 left-2 text-xs text-gray-700 bg-white/90 px-2 py-1 rounded-sm">
                    Click on a city to select
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Filter by district */}
              <div className="p-2 border-b border-gray-100 bg-gray-50">
                <div className="text-xs font-medium text-gray-500 mb-1.5">Filter by District</div>
                <div className="flex flex-wrap gap-1 max-h-[60px] overflow-y-auto">
                  {districts.map(district => (
                    <button
                      key={district}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        selectedDistrict === district
                          ? 'bg-medical-teal-100 text-medical-teal-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => handleDistrictSelect(district)}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* City and area selection */}
              <div className="p-2">
                <div className="text-xs font-medium text-medical-teal-600 px-2 py-1">
                  Cities & Areas
                </div>
                <div className="mt-1 max-h-[250px] overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((city, index) => (
                      <div key={index} className="mb-2">
                        <div className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-sm">
                          {city.name}{city.district !== city.name ? ` (${city.district})` : ''}
                        </div>
                        <div className="ml-2 mt-1 space-y-1">
                          {city.areas.map((area: string, areaIndex: number) => (
                            <div
                              key={`${city.name}-${areaIndex}`}
                              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-medical-teal-50 hover:text-medical-teal-700 rounded-md cursor-pointer transition-colors flex items-center"
                              onClick={() => handleLocationSelect(`${area}, ${city.name}`)}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-400 mr-2"></span>
                              {area}
                            </div>
                          ))}
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                      No locations found. Try a different search.
                  </div>
                )}
              </div>
            </div>
            </>
          )}
            
          <div className="p-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 rounded-b-md flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-400 mr-1.5"></span>
            MedConnect serves all major cities in {region}
            </div>
          </div>
        )}
      </div>
  );
} 