<GridLayout rows="50, *">
      <ActivityIndicator
        row="1"
        verticalAlignment="center"
        horizontalAlignment="middle"
        :busy="loading"
      />
      <!-- fake tabview, implementation can be a bit nicer, but it works -->
      <GridLayout row="0" width="100%" columns="*,*,*" height="50" class="tabView">
        <CenterLabel
          v-for="(category, idx) in categories"
          :key="category"
          :col="idx"
          height="50"
          :text="'article.'+category | L"
          class="tab"
          :class="tabActive === category ? 'selected' : ''"
          @tap="toggleTab(category)"
        ></CenterLabel>
      </GridLayout>

      <RadListView row="1" for="item in articles" height="100%" @itemTap="loadArticle">
        <v-template>
          <GridLayout class="article" columns="80, *" rows="auto, auto, *">
            <CachedImage
              col="0"
              rowSpan="2"
              class="thumbNail img-rounded p-5"
              stretch="aspectFill"
              :source="getImageFromItem(item)"
              height="80"
              textWrap="true"
              placeholder="~/assets/images/placeholder.png"
            />
            <Label col="1" row="0" class="h2 p-5" :text="item.title"></Label>
            <Label
              col="1"
              row="1"
              v-if="item.publishedDate && item.category === 'news'"
              class="date"
              verticalAlignment="top"
              :text="toPrettyDate(item.publishedDate)"
            ></Label>
           
            <Label
              col="0"
              colSpan="2"
              row="2"
              height="60"
              class="text p-5"
              verticalAlignment="top"
              textWrap="true"
              :text="item.text ? item.text.replace(/#/i, '') : ''"
            ></Label>
             <Label col="0"
              colSpan="2"
              row="2"
              height="60"
              class="overlay"
              ></Label>
          </GridLayout>
        </v-template>
      </RadListView>
    </GridLayout>




    <!--- GMAPS -->
         <Tabs selectedIndex="0" tabsPosition="top" ref="tabs">
       <TabStrip>
        <TabStripItem>            
          <Label :text="'nav.points.map' | L"></Label>
            <!-- <Image src="font://&#xf015;" class="fas"></Image> -->
        </TabStripItem>
        <TabStripItem>            
          <Label :text="'nav.points.points' | L"></Label>
            <!-- <Image src="font://&#xf015;" class="fas"></Image> -->
        </TabStripItem>
      </TabStrip>
    <TabContentItem>
      <GoogleMap mapId="points" ref="gMap" :pois="poisToDisplay" @markerSelect="showPointInfo" />
    </TabContentItem>
    <TabContentItem>
      <GridLayout>
          <RadListView for="poi in poisToDisplay" height="100%" @itemTap="showPointInfoFromList">
            <v-template>
              <Label :text="poi.title"></Label>
            </v-template>
          </RadListView>
      </GridLayout>
     </TabContentItem>
    </Tabs>



<!-- ROUTE --> <template>
<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*, 80">
      <!-- <Label row="0" rowSpan="2" width="100%" height="100%" class="mapPlaceholder"></Label> -->
      <GoogleMap
        row="0"
        rowspan="2"
        :mapId="this.route.id"
        :pois="poisToDisplay"
        :path="this.route.path"
        @markerSelect="selectMarker"
        :currentPoi="currentPoi"
      ></GoogleMap>
      <RadListView
        row="1"
        class="points"
        ref="listView"
        for="(poi, index) in poisToDisplay"
        @itemTap="openPoint"
        @loaded="listLoaded"
        itemHeight="50"
        itemInsertAnimation="Fade"
        itemDeleteAnimation="Fade"
      >
        <v-template>
          <GridLayout rows="*" columns="70, 0, *, 100" :key="poi.id" :id="poi.id" class="point">
            <Button row="0" col="0" class="-rounded-lg pointIndex" :text="index + 1"></Button>
            <CenterLabel
              row="0"
              col="2"
              class="-rounded pointDescription"
              :text="poi.title"
              :centerMethod="16"
              textWrap="true"
            ></CenterLabel>
            <Button col="3" class="pointButton" :text="'point.info' | L" @tap="getInfoFor(poi)"></Button>
          </GridLayout>
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>
