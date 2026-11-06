import { NextRequest } from "next/server";
import payload from "@/lib/payload";
import { readUploadToken, saveImage } from "@/lib/mcpUploads";

// Photo upload page behind a signed, 60-minute link from the createUploadLink MCP tool. Photos are resized and
// re-encoded as JPEG in the browser (keeps each request under Vercel's ~4.5MB limit, converts iPhone HEIC),
// then sent one per request.
type Ctx = { params: Promise<{ token: string }> };

const HEADERS = {
  "Cache-Control": "no-store",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "same-origin",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src blob: data:; connect-src 'self'; frame-ancestors 'none'",
};

const page = (body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>رفع الصور · Upload photos</title>
<style>body{font-family:system-ui,sans-serif;background:#f0f0f0;margin:0;padding:24px 16px;color:#0f1424}
main{background:#fff;max-width:520px;margin:0 auto;padding:24px;border-radius:16px;border:1px solid #e0e0e0}
h1{font-size:20px;margin:0 0 6px}p{color:#555;margin:0 0 16px;line-height:1.5}
label.pick{display:block;text-align:center;background:#0477bd;color:#fff;padding:16px;border-radius:12px;font-weight:600;cursor:pointer;font-size:17px}
input{display:none}ul{list-style:none;padding:0;margin:16px 0 0;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
li{position:relative;aspect-ratio:1;border-radius:10px;overflow:hidden;background:#eee}li img{width:100%;height:100%;object-fit:cover}
li span{position:absolute;inset-inline-end:6px;bottom:6px;background:#fff;border-radius:99px;padding:2px 8px;font-size:12px;font-weight:600}
.ok{color:#15803d}.err{color:#b91c1c}#status{margin-top:14px;font-weight:600}</style></head><body><main>${body}</main></body></html>`,
    { status, headers: { ...HEADERS, "Content-Type": "text/html; charset=utf-8" } },
  );

export async function GET(_req: NextRequest, { params }: Ctx) {
  const link = readUploadToken((await params).token);
  if (!link) return page(`<h1>انتهت صلاحية الرابط · Link expired</h1><p>اطلب رابطًا جديدًا من المساعد. Ask the assistant for a new link.</p>`, 410);
  const where = link.target ? (link.target.type === "posts" ? "ستُضاف إلى معرض الخبر. Added to the post's gallery." : "ستُضاف إلى معرض النشاط. Added to the activity's gallery.") : "";
  return page(`<h1>رفع الصور · Upload photos</h1>
<p>اختر صورة أو أكثر من الهاتف. ${where}<br>Pick one or more photos.</p>
<label class="pick">اختيار الصور · Choose photos<input id="f" type="file" accept="image/*" multiple></label>
<div id="status"></div><ul id="list"></ul>
<script>
const f=document.getElementById("f"),list=document.getElementById("list"),status=document.getElementById("status");
let done=0,failed=0,total=0;
const show=()=>{status.textContent=(total?("تم رفع "+done+" من "+total+" · "+done+"/"+total+" uploaded"):"")+(failed?(" · فشل "+failed+" failed"):"");status.className=failed?"err":(done===total&&total?"ok":"")};
const load=(file)=>new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=URL.createObjectURL(file)});
async function shrink(file){const img=await load(file);const max=2560,s=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
 const c=document.createElement("canvas");c.width=Math.round(img.naturalWidth*s);c.height=Math.round(img.naturalHeight*s);c.getContext("2d").drawImage(img,0,0,c.width,c.height);
 return {blob:await new Promise(r=>c.toBlob(r,"image/jpeg",0.9)),preview:img.src};}
f.onchange=async()=>{const files=[...f.files];total+=files.length;show();
 for(const file of files){const li=document.createElement("li");const tag=document.createElement("span");tag.textContent="…";li.appendChild(tag);list.prepend(li);
  try{const {blob,preview}=await shrink(file);const im=document.createElement("img");im.src=preview;li.prepend(im);
   const r=await fetch(location.pathname,{method:"POST",headers:{"Content-Type":"image/jpeg","X-Filename":encodeURIComponent(file.name)},body:blob});
   const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||r.status);done++;tag.textContent="✓";tag.className="ok";}
  catch(e){failed++;tag.textContent="✕";tag.className="err";tag.title=String(e.message||e);}show();}
 f.value="";};
</script>`);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const link = readUploadToken((await params).token);
  if (!link) return Response.json({ ok: false, error: "Link expired" }, { status: 410, headers: HEADERS });
  try {
    const data = Buffer.from(await req.arrayBuffer());
    const filename = decodeURIComponent(req.headers.get("x-filename") || "photo.jpg");
    const doc = await saveImage(payload, { data, filename, target: link.target, batch: link.batch });
    return Response.json({ ok: true, id: doc.id }, { headers: HEADERS });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, { status: 400, headers: HEADERS });
  }
}
