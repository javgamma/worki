import { View, Text, FlatList, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import GeneralApi from '../../Services/GeneralApi';

export default function Slider() {
  const [slider, setSliderList] = useState();
  
  useEffect(()=>{
    getSlider();
  },[])

  const getSlider=()=>{
    GeneralApi.getSlider().then(resp=>{
      // console.log(resp.data.data);
      setSliderList(resp.data.data)      
    })
  }

  return (
    <View style={{ marginTop: 10 }}>
      {
        <FlatList
          data={slider}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.Image.url }}
              style={{
                width: Dimensions.get("screen").width * 0.6,
                height: 170,
                borderRadius:10,
                margin:2
              }}
            />
          )}
        />
      }
    </View>
  );
}