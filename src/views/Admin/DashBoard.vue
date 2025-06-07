<template>
  <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" size="32" class="me-3">mdi-package-variant</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Tổng đơn hàng</span>
              </div>
              <div class="text-h5 font-weight-bold">10</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon color="success" size="32" class="me-3">mdi-currency-usd</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Doanh thu</span>
              </div>
              <div class="text-h5 font-weight-bold">10.000.000 vnd</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon color="info" size="32" class="me-3">mdi-cube-outline</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Sản phẩm</span>
              </div>
              <div class="text-h5 font-weight-bold">10</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-icon color="warning" size="32" class="me-3">mdi-account-group</v-icon>
                <span class="text-subtitle-1 font-weight-medium">Người dùng</span>
              </div>
              <div class="text-h5 font-weight-bold">5</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-medium py-4 px-4">
              Doanh thu 7 ngày gần nhất
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <line/>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-medium py-4 px-4">
              Trạng thái đơn hàng
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <div style="height: 200px">
                <pie-chart/>
              </div>
              <div class="text-center mt-4">
                <div class="text-h6 font-weight-medium">
                  Tổng số đơn hàng
                </div>
                 <div class="text-h5 font-weight-bold">10</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        </v-row>
        

        <v-row class="mt-4">
          <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-medium py-4 px-4">
              Top sản phẩm bán chạy
            </v-card-title>
            <v-divider></v-divider>
            <v-list>
              <v-list-item >
                <v-list-item-title>ao jean</v-list-item-title>
                <template v-slot:append>
                  <div class="text-right">
                    <div class="text-body-2 font-weight-medium">
                      Đã bán: 5
                    </div>
                    <div class="text-caption text-primary">
                      Doanh thu: 1.000.000 vnd
                    </div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-medium py-4 px-4 d-flex justify-space-between">
              <span>Đánh giá gần đây</span>
              <v-chip color="primary" size="small">
                5 đánh giá
              </v-chip>
            </v-card-title>
            <v-divider></v-divider>
            <v-list>
              <v-list-item >
                <template v-slot:prepend>
                  <v-rating
                    :model-value="5"
                    readonly
                    density="compact"
                    size="small"
                    color="warning"
                  ></v-rating>
                </template>
                
                <v-list-item-title>minh quan</v-list-item-title>
                <v-list-item-subtitle>chat luong 5 sao</v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-chip
                    :color="true ? 'success' : 'warning'"
                    size="small"
                    class="font-weight-medium"
                  >
                    da duyet
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center py-4 px-4">
              <span class="text-subtitle-1 font-weight-medium">Thống kê theo thời gian</span>
              <v-row class="flex-grow-0" style="width: auto">
                <v-col cols="auto">
                  <v-text-field
                    
                    label="Từ ngày"
                    type="date"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-text-field
                   
                    label="Đến ngày"
                    type="date"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="primary">
                    Xem thống kê
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            
            <v-card-text >
              <!-- Summary Cards -->
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="text-subtitle-2 mb-1">Tổng đơn hàng</div>
                      <div class="text-h6">100</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="text-subtitle-2 mb-1">Tổng doanh thu</div>
                      <div class="text-h6">50.000.000 vnd</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="text-subtitle-2 mb-1">Giá trị TB/đơn</div>
                      <div class="text-h6">150.000 vnd</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card variant="outlined">
                    <v-card-text>
                      <div class="text-subtitle-2 mb-1">Số ngày</div>
                      <div class="text-h6">5 ngày</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Chart -->
              <v-row class="mt-4">
                <v-col cols="12">
                  <v-card>
                    <v-card-text>
                      <div style="height: 200px">
                        <line-chart/>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Top Products -->
              <v-row class="mt-4">
                <v-col cols="12">
                  <div class="text-subtitle-1 font-weight-medium mb-4">Top sản phẩm bán chạy</div>
                  <v-table>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th class="text-right">Số lượng</th>
                        <th class="text-right">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                  <!-- v-for-->
                      <tr>
                        <td>san pham 1</td>
                        <td class="text-right">10 san pham</td>
                        <td class="text-right">50.000.000 vnd</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

          
  </v-container>
</template>
<script setup>

</script>

