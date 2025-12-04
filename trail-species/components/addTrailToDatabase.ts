'use server'

import { createClient } from '@/utils/supabase/server'
import { getUser } from "@/utils/supabase/getUser"

const LARGEST_DISTANCE_ALOTTED_IN_MILES = 200
const MAX_NUMBER_NODES = 100


export async function addTrailToDatabase(features: any, trail_name: String) {
    const supabase = await createClient()
    const user = await getUser()

    if (!user) {
      return { error: "Not authenticated", status: 401 }
    }
    console.log("validating features")
    
    const validationResponse = validate_trail(features)
    console.log(validationResponse)

    if (validationResponse.status !== 200) {
      console.log("exiting")
      return { error: validationResponse.error, status: validationResponse.status }
    }

    const new_custom_trail = {
      features: features,
      user_id: user.id,
      trail_name: trail_name
    }
    
    const {data, error} = await supabase
    .from("custom_trails")
    .insert(new_custom_trail)
    .select();

    if (error) {
      console.error('Insert error:', error.message);
      return { error: error.message, status: 500 }
    }

    console.log('Data inserted successfully:', data);
    return { data: data, status: 200 }
}

//max number of feature.
// max trails by a certain user

function calculate_haversine_distance(lon1:number, lat1:number, lon2:number, lat2:number){
  const R = 3958.8; // Earth's radius in miles
  const rlat1 = lat1 * (Math.PI / 180)
  const rlon1 = lon1 * (Math.PI / 180)
  const rlat2 = lat2 * (Math.PI / 180)
  const rlon2 = lon2 * (Math.PI / 180)

  const a = Math.sin((rlat1-rlat2)/2)**2 + Math.cos(rlat1)* Math.cos(rlat2)* Math.sin((rlon1-rlon2)/2)**2 

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const miles_distance = R * c
  
  return miles_distance
}

function get_furthest_haversine_distance(feature_list: any){
    let furthest_distance = -1
    let cur_dist = 0
    let coordinates: number[][] = []

    feature_list.forEach((feature: any) => {
      feature["geometry"]["coordinates"].forEach((coord:number[])=> {
        coordinates.push(coord)
      })
    })

    coordinates.forEach((coordA: number[]) => {
      coordinates.forEach((coordB: number[]) => {
        if (coordA != coordB){
          cur_dist = calculate_haversine_distance(coordA[0],coordA[1],coordB[0],coordB[1])

          furthest_distance = Math.max(furthest_distance, cur_dist)
        }
      })
    })
    
    return furthest_distance
}

function get_number_nodes(feature_list: any){
    let node_count = 0

    feature_list.forEach((feature: any) => {
      feature["geometry"]["coordinates"].forEach((coord: Number[]) => {
        node_count += 1
      })
    })
    
    return node_count
}

function validate_trail(features: any){
  try {
    if (features == null) { // no features
      return { error: "No points selected", status: 401 } 
    }

    const feature_list = features["features"]

    if (feature_list.length == 0) { // no features
      return { error: "No points selected", status: 401 } 
    }

    let num_nodes = get_number_nodes(feature_list)
    console.log("number of trail nodes:" + num_nodes)

    if (num_nodes > MAX_NUMBER_NODES) { // too many nodes
      return { error: "Node Count " + num_nodes +" greater than maximum nodes: ("+MAX_NUMBER_NODES+")", status: 401 } 
    }

    let furthest_distance = get_furthest_haversine_distance(feature_list)
    console.log("furthest distance in trail: " + furthest_distance)

    if (furthest_distance > LARGEST_DISTANCE_ALOTTED_IN_MILES) { // trail too long
      return { error: "Trail Size ("+furthest_distance+" mi) above maximum size of (" + (LARGEST_DISTANCE_ALOTTED_IN_MILES) + " mi)", status: 401 } 
    }

    /// if user has too many trails already. //

    return { success: true, status: 200 } 

  } catch (error) {
    return { error: "Internal Error: " + error, status: 401 } 
  }
  
}

