import React, {useRef} from 'react'
import { Pencil } from '../icons/icons'

const Avatar = (props) => {
    const fileInputRef = useRef(null)

    const blankclassXS = 'relative w-5 h-5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600'
    const blankclassSM = 'relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600'
    const blankclassMD = 'relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600'
    const blanksvgXS = 'absolute w-6 h-6 text-gray-400 -left-0.5'
    const blanksvgSM = 'absolute w-12 h-12 text-gray-400 -left-1'
    const blanksvgMD = 'absolute w-24 h-24 text-gray-400 -left-2'

    let blanksvg = (props.size==='xs')?blanksvgXS:(props.size==='sm')?blanksvgSM:blanksvgMD
    let blankclass = (props.size==='xs')?blankclassXS:(props.size==='sm')?blankclassSM:blankclassMD

    let imgclass = (props.size==='xs')?'w-5 h-5 rounded-full':(props.size==='sm')?'w-10 h-10 rounded-full':'w-20 h-20 rounded-full'
    
    const handleEditClick = (e) => {
        e.stopPropagation()
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                props.onImageSelect(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            console.log('No file selected.');
        }
    }

    return (
        <>
        <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
        />

        {!props.image && !props.edit &&
            <div class={blankclass}>
                <svg class={blanksvg} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div> 
        }

        {!props.image && props.edit &&
            <>
            <div class={blankclass} onClick={handleEditClick}>
                <svg class={blanksvg} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                
            </div> 
            {props.size==='md' && 
                <div class="relative w-20 h-20 -top-20 text-gray-700 cursor-pointer" onClick={handleEditClick}><div class="absolute -right-1 -bottom-1 "><Pencil w={4}/></div></div>
            }
            
            </>
        }

        {props.image && !props.edit &&
            <img class={imgclass} src={props.image} alt="Rounded avatar"></img>
        }

        {props.image && props.edit &&
            <>
            <img class={imgclass} src={props.image} alt="Rounded avatar"></img>
            {props.size==='md' && 
                <div class="relative w-20 h-20 -top-20 text-gray-700 cursor-pointer" onClick={handleEditClick}><div class="absolute -right-1 -bottom-1 "><Pencil w={4}/></div></div>
            }
            </>
        }

        </>
    )
}

export default Avatar