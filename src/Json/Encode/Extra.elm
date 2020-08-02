module Json.Encode.Extra exposing (Encoder, maybe, posix)

import Json.Encode exposing (Value, int, null)
import Maybe exposing (Maybe(..))
import Time exposing (Posix, posixToMillis)


type alias Encoder v =
    v -> Value


maybe : Encoder v -> Encoder (Maybe v)
maybe encoder maybeValue =
    case maybeValue of
        Just value ->
            encoder value

        Nothing ->
            null


posix : Encoder Posix
posix =
    int << posixToMillis
