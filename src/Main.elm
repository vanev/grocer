port module Main exposing (main)

import Browser exposing (element)
import Dict exposing (empty)
import Json.Decode exposing (decodeValue)
import Json.Encode exposing (Value)
import Model exposing (Model)
import Msg exposing (Msg(..))
import Update exposing (update)


init : Value -> ( Model, Cmd Msg )
init flags =
    ( case decodeValue Model.decode flags of
        Ok model ->
            model

        Err _ ->
            { name = ""
            , items = empty
            , ordering = []
            , itemBeingDragged = Nothing
            }
    , Cmd.none
    )


port storeData : Value -> Cmd msg


updateWithStorage : Msg -> Model -> ( Model, Cmd Msg )
updateWithStorage msg oldModel =
    let
        ( newModel, cmds ) =
            Update.update msg oldModel
    in
    ( newModel
    , Cmd.batch [ storeData (Model.encode newModel), cmds ]
    )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


main : Program Value Model Msg
main =
    element
        { init = init
        , view = Model.view
        , update = updateWithStorage
        , subscriptions = subscriptions
        }
