/* eslint-disable @typescript-eslint/no-explicit-any */
import '../style/back.css'
import HomeLayout from '@/components/custom/HomeLayout';

export default async function Page() {

  
  const img_base_url = `${process.env.TMDB_IMG_URL}/${process.env.TMDB_IMG_THUMB_SIZE}`

  return (
  <div className="h-screen w-full custom-bg mx-auto">
      <div className="wbf p-5 backdrop-blur-3xl w-full h-full flex items-center justify-center">
        <HomeLayout ImageBase={img_base_url}/>
      </div>
  </div>   
  );
}
