function appenListBlock(id, list, block_id){
	var clone = list.clone().attr('name', 'block_'+id);
	clone.find('option[value="'+block_id+'"]').attr('selected', 'yes');
	$('#tdlist_'+id).append(clone);
}