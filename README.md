# MAP API 調査
## API 発行
- [Google Map API](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [MapBox API](https://docs.mapbox.com/help/glossary/access-token/)
## Quick start
ルートディレクトリに`.env.local`ファイルを作り中身を以下のように設定する  
```
NEXT_PUBLIC_GOOGLE_MAP_API_KEY="Google Map APIのKey"
NEXT_PUBLIC_MAPBOX_API_KEY="MapBox APIのKey"
```
ターミナルで以下を実行
```
$ npm i
$ npm run dev
```
> [!NOTE]
> 2024/05/20現在：MapBoxの方でしか開発を進めていません。GoogleMapの方は余裕があれば作ります。

## 使い方
1. 検索窓に場所を打ち込んで「Search」を押すとマーカーが追加される。
1. 「Route Search」を押すと現在地からマーカまでのルートが検索できる。　