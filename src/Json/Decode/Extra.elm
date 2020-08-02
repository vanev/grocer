module Json.Decode.Extra exposing (posix)

import Json.Decode exposing (Decoder, int, map)
import Time exposing (Posix, millisToPosix)


posix : Decoder Posix
posix =
    map millisToPosix int
