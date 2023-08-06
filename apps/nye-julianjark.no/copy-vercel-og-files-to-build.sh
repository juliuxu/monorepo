# Files needed for @vercel/og to work
mkdir -p ./build
if [ -d "./node_modules/@vercel/og/" ]; then
  cp ./node_modules/@vercel/og/dist/noto-sans-v27-latin-regular.ttf ./build/
  cp ./node_modules/@vercel/og/dist/yoga.wasm ./build/
  cp ./node_modules/@vercel/og/dist/resvg.wasm ./build/
else
  cp ../../node_modules/@vercel/og/dist/noto-sans-v27-latin-regular.ttf ./build/
  cp ../../node_modules/@vercel/og/dist/yoga.wasm ./build/
  cp ../../node_modules/@vercel/og/dist/resvg.wasm ./build/
fi
