module Model exposing
    ( Model
    , addItem
    , decode
    , encode
    , getFromItem
    , getItem
    , itemIsDeleted
    , updateItem
    , view
    )

import Dict exposing (Dict, insert, size)
import Html exposing (Html, button, div, input, text, ul)
import Html.Attributes exposing (class, placeholder, type_, value)
import Html.Events exposing (onClick, onInput)
import Id exposing (Id)
import Item exposing (Item, isDeleted)
import Json.Decode as D
import Json.Encode as E
import Json.Encode.Extra as EE
import Maybe exposing (Maybe)
import Msg exposing (Msg(..))
import Ordering exposing (snoc)
import String exposing (fromInt)
import Time exposing (Posix)


type alias Model =
    { name : String
    , items : Dict Id Item
    , ordering : List Id
    , itemBeingDragged : Maybe Id
    }


getItem : Id -> Model -> Maybe Item
getItem id =
    Dict.get id << .items


newItem : Id -> Posix -> Item
newItem id timestamp =
    { id = id
    , description = ""
    , createdAt = timestamp
    , completedAt = Nothing
    , deletedAt = Nothing
    }


addItem : Posix -> Model -> Model
addItem timestamp model =
    let
        id =
            fromInt (size model.items)
    in
    { model
        | items = insert id (newItem id timestamp) model.items
        , ordering = snoc id model.ordering
    }


updateItem : (Item -> Item) -> Id -> Model -> Model
updateItem updater id model =
    { model
        | items = Dict.update id (Maybe.map updater) model.items
    }


getFromItem : (Item -> a) -> Id -> Model -> Maybe a
getFromItem getter id =
    Maybe.map getter << getItem id


itemIsDeleted : Id -> Model -> Maybe Bool
itemIsDeleted =
    getFromItem isDeleted


encode : EE.Encoder Model
encode model =
    E.object
        [ ( "name", E.string model.name )
        , ( "items", E.dict identity Item.encode model.items )
        , ( "ordering", E.list E.string model.ordering )
        , ( "itemBeingDragged", E.null )
        ]


decode : D.Decoder Model
decode =
    D.map4 Model
        (D.field "name" D.string)
        (D.field "items" (D.dict Item.decode))
        (D.field "ordering" (D.list D.string))
        (D.field "itemBeingDragged" (D.maybe D.string))


nameView : String -> Html Msg
nameView name =
    input
        [ type_ "text"
        , class "List--Name"
        , placeholder "My Grocery List"
        , value name
        , onInput ListNameChange
        ]
        []


itemsView : List Id -> Dict Id Item -> Html Msg
itemsView ordering allItems =
    let
        items =
            List.filterMap (\id -> Dict.get id allItems) ordering
    in
    ul [ class "List--Items" ] <| List.map Item.view items


createItemView : Html Msg
createItemView =
    button
        [ class "List--CreateItem"
        , onClick CreateItemClick
        ]
        [ text "Add Item" ]


view : Model -> Html Msg
view model =
    div [ class "List" ]
        [ nameView model.name
        , itemsView model.ordering model.items
        , createItemView
        ]
