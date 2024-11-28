import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "./catalyst/dialog.jsx";
import { Button } from "./catalyst/button.jsx";
import { Strong, Text } from "./catalyst/text.jsx";
import useOCR from "../hooks/useOCR.js";

const ProgressBar = ({ progress }) => {
  return (
    <div className="rounded-full bg-gray-200">
      <div
        style={{ width: `${progress}%` }}
        className="h-2 rounded-full bg-indigo-600"
      />
    </div>
  );
};

const grayscaleImage = (bitmap) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
    data[i] = data[i + 1] = data[i + 2] = grayscale;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const applyThreshold = (canvas, threshold = 128) => {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const value = avg > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = value;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const resizeImage = (canvas, scaleFactor) => {
  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = canvas.width * scaleFactor;
  resizedCanvas.height = canvas.height * scaleFactor;
  const ctx = resizedCanvas.getContext("2d");
  ctx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
  return resizedCanvas;
};

const preprocessBitmap = async (bitmap) => {
  // Convert to grayscale
  let canvas = grayscaleImage(bitmap);

  // Apply thresholding
  canvas = applyThreshold(canvas, 128);

  // Resize the image
  canvas = resizeImage(canvas, 1.5);

  // Convert the processed canvas back to a bitmap
  return createImageBitmap(canvas);
};

const OCR = ({ open, setOpen, imageUrl, success, error }) => {
  const { ocr, progress } = useOCR();

  if (!open) {
    return;
  }

  const handleScreenCapture = async () => {
    try {
      // Request screen capture stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      // Wait for the video to load metadata
      await new Promise((resolve) => (video.onloadedmetadata = resolve));

      // Use createImageBitmap to extract the frame
      const bitmap = await createImageBitmap(video);
      console.log(bitmap);

      stream.getTracks().forEach((track) => track.stop());

      const processedBitmap = await preprocessBitmap(bitmap);
      ocr(processedBitmap);
    } catch (err) {
      console.error("Error capturing screen:", err);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="dark">
      <DialogTitle>Bounty detection</DialogTitle>
      <DialogDescription>
        We&apos;ll capture a screenshot and try to detect bounties using OCR.
      </DialogDescription>
      <DialogBody>
        <Text className="mb-4">
          Tips:
          <ul className="list-disc ml-5 mt-1">
            {/* TODO: Change this */}
            <li>Currently only English is supported</li>
            <li>
              Your bounties (and optionally, the bounty board) must be visible
              on the screen.
            </li>
            <li>Make the bounty text as large as possible</li>
            <li>Adjust your game and window size if OCR is not working.</li>
            <li>
              OCR isn&apos;t perfect, so it may take a few tries and resizing.
              Once it works, it should work consistently for that window size.
            </li>
          </ul>
        </Text>
        <Text>
          When prompted, select <Strong>Window &rarr; Brighter Shores.</Strong>
        </Text>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleScreenCapture}>
          Screenshot
        </Button>
      </DialogActions>
    </Dialog>
  );

  // return (
  //   <Dialog open={open} className="relative z-10" onClose={() => {}}>
  //     <DialogBackdrop
  //       transition
  //       className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
  //     />
  //
  //     <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
  //       <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
  //         <DialogPanel
  //           transition
  //           className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
  //         >
  //           <div>
  //             <div className="text-center">
  //               <DialogTitle
  //                 as="h3"
  //                 className="text-base font-semibold text-gray-900 mb-2"
  //               >
  //                 Detecting bounties...
  //               </DialogTitle>
  //               <img src={imageUrl} alt="Uploaded image" className="my-5" />
  //               <div>
  //                 <p className="text-sm text-gray-500">
  //                   OCR is currently detecting bounties in the image. This may
  //                   take a few moments..
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="mt-5 sm:mt-6">
  //             <ProgressBar progress={progress} />
  //             {/*<button*/}
  //             {/*  type="button"*/}
  //             {/*  onClick={() => setOpen(false)}*/}
  //             {/*  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"*/}
  //             {/*>*/}
  //             {/*  Go back to dashboard*/}
  //             {/*</button>*/}
  //           </div>
  //         </DialogPanel>
  //       </div>
  //     </div>
  //   </Dialog>
  // );
};

// const OCR = ({ children }) => {
//   const client = useRef(null);
//
//   const [imageUrl, setImageUrl] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [progress, setProgress] = useState(0);
//
//   const ocr = useCallback((imageUrl) => {
//     const loadClient = async () => {
//       client.current = new OCRClient();
//       await client.current.loadModel(
//         "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata",
//       );
//     };
//
//     const ocr = async () => {
//       const res = await fetch(imageUrl);
//       const blob = await res.blob();
//       const bitmap = await createImageBitmap(blob);
//
//       await client.current.loadImage(bitmap);
//       return client.current.getTextBoxes("line", setProgress);
//     };
//
//     const run = async () => {
//       if (!client.current) {
//         await loadClient();
//       }
//
//       const textBoxes = await ocr();
//
//       const names = Object.values(bounties).map((bounty) =>
//         bounty.name.toLowerCase(),
//       );
//       const result = {
//         bounties: {},
//         availableBounties: {},
//       };
//
//       console.log(textBoxes);
//
//       let type = "";
//       for (const textBox of textBoxes) {
//         if (textBox.text.toLowerCase().includes("available bounties")) {
//           type = "availableBounties";
//         }
//
//         if (textBox.text.toLowerCase().includes("bounties")) {
//           type = "bounties";
//         }
//
//         if (!type) {
//           continue;
//         }
//
//         const defaultedType = type === "" ? "availableBounties" : type;
//
//         for (const name of names) {
//           if (textBox.text.toLowerCase().includes(name)) {
//             const key = name.toUpperCase().replaceAll(" ", "_");
//             if (!result[defaultedType][key]) {
//               result[defaultedType][key] = 1;
//             } else {
//               result[defaultedType][key] += 1;
//             }
//           }
//         }
//       }
//
//       console.log(result);
//     };
//
//     setImageUrl(imageUrl);
//     setOpen(true);
//     setProgress(0);
//
//     run();
//   }, []);
//
//   return (
//     <div onPaste={onPaste}>
//       <Modal
//         open={open}
//         setOpen={setOpen}
//         imageUrl={imageUrl}
//         progress={progress}
//       />
//       {children}
//     </div>
//   );
// };

export default OCR;
