const express = require('express')
const app = express()
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

const MoveType = new GraphQLObjectType({
    name:"Move",
    description:"A Single Pokemon Move",
    feilds: ()=>({
        name: {type:GraphQLString},
        url: {type: GraphQLString}
    })
})
const AbilityType = new GraphQLObjectType({
    name:"Ability",
    description:"A Single Pokemon Ability",
    fields:()=>({
        name:{type: GraphQLString},
        url: {type: GraphQLString}
    })
})
const FormType = new GraphQLObjectType({
    name:"Pokemon Form",
    description:"A Single Pokemon Form",
    fields:()=>({
        name:{type: GraphQLString},
        url: {type: GraphQLString}
    })
})
const VersionType = new GraphQLObjectType({
    name:"Pokemon Game Version",
    description:"A Single Pokemon Game Version (red, blue, yellow)",
    fields:()=>({
        name:{
            type: GraphQLString,
            resolve: game => game.version.name
        },
        url:{
            type:GraphQLString,
            resolve: game => game.version.url
        }
    })
})
const PokemonType = new GraphQLObjectType({
    name:"Pokemon",
    description:"A Single Pokemon",
    fields:()=>({
        name: {type: GraphQLString},
        id: {type: GraphQLNonNull(GraphQLInt)},
        abilities:{type: GraphQLList(AbilityType)},
        forms:{type: GraphQLList(FormType)},
        game_indices: {type: GraphQLList(VersionType)},
        height: {type: GraphQLInt},
        moves: {type: GraphQLList(MoveType)},
        weight: {type: GraphQLInt},
    })
})
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

 const fetchResponseByURL = relativeURL=> {
  return fetch(`${BASE_URL}${relativeURL}`).then(res => res.json());
}

const  fetchPokemon = pokemon => {
  return fetch(`${BASE_URL}${pokemon}`).then(res => res.json());
}

// const  fetchPersonByURL = relativeURL =>{
//   return fetchResponseByURL(relativeURL).then(json => json.person);
// }
const schema = new GraphQLSchema({
    name: 'Root',
  description: 'root',
    query:new GraphQLObjectType({
        fields:()=>({
            pokemon: {
                type: PokemonType,
                args:{
                    name:{ type: GraphQLString }
                },
                resolve: (root, args)=> fetchPokemon(args)
            }
        })
    })
})
const expressGraphQL = require("express-graphql")
app.use("/graphql", expressGraphQL({
    graphiql:true,
    schema:schema
}))
app.listen(7770, ()=>console.log("server running on port 7770"))