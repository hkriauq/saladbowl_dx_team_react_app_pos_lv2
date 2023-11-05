import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
    
 function AdGallery() {
      return (
        <div style={{ display:'flex', gap:8}}>
            <Card sx={{ alignItems: 'center', marginBottom:10, border: '1px solid #CCCCCC', paddingBottom: '0px' }}>
                <CardMedia
                    sx={{ height: 150, width: 220 }}
                    image="/images/ad_1.png" 
                    title="トマト" />
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} component="div">
                    ゼラニウム ボディクレンザー
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                        <p>3,800円</p>
                    </Typography>
                </CardContent>

            </Card>

            <Card sx={{ alignItems: 'center', marginBottom:10 , border: '1px solid #CCCCCC',paddingBottom: '0px'}}>
                <CardMedia
                    sx={{ height: 150, width: 220 }}
                    image="/images/ad_2.png" 
                    title="きゅうり" />
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} component="div">
                        マイルドウォッシュ
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                        <p>2,800円</p>
                    </Typography>
                </CardContent>

            </Card>

            <Card sx={{ alignItems: 'center', marginBottom:10 , border: '1px solid #CCCCCC',paddingBottom: '0px'}}>
                    <CardMedia
                        sx={{ height: 150, width: 220 }}
                        image="/images/ad_3.png" 
                        title="ルッコラ" />
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} component="div">
                         フェイシャル トリートメント
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                            <p>12,300円</p>
                        </Typography>
                    </CardContent>
                
            </Card>
        </div>
      );
    }

export default AdGallery;